import { describe, expect, it } from "vitest";
import type {
  CharacterInventoryDraft,
  CharacterInventoryEntry,
  CharacterInventoryUpdate,
} from "@/domain/character-inventory";
import type { CharacterInventoryRepository } from "@/repositories/character-inventory-repository";
import {
  CharacterInventoryNotFoundError,
  CharacterInventoryService,
} from "@/services/character-inventory-service";

class MemoryInventoryRepository implements CharacterInventoryRepository {
  public entry: CharacterInventoryEntry | null = null;

  public async listByCampaign(): Promise<CharacterInventoryEntry[]> {
    return this.entry ? [this.entry] : [];
  }

  public async listByCharacter(): Promise<CharacterInventoryEntry[]> {
    return this.entry ? [this.entry] : [];
  }

  public async add(
    campaignId: string,
    characterId: string,
    draft: CharacterInventoryDraft,
  ): Promise<CharacterInventoryEntry | null> {
    if (this.entry) return null;
    this.entry = {
      id: "inventory-1",
      campaignId,
      characterId,
      ...draft,
      itemName: "Messingkompass",
      itemSummary: "Zeigt auf verborgene Wege.",
      createdAt: new Date("2026-07-20T18:00:00.000Z"),
      updatedAt: new Date("2026-07-20T18:00:00.000Z"),
    };
    return this.entry;
  }

  public async update(
    _campaignId: string,
    _characterId: string,
    _entryId: string,
    draft: CharacterInventoryUpdate,
  ): Promise<CharacterInventoryEntry | null> {
    if (!this.entry) return null;
    this.entry = { ...this.entry, ...draft };
    return this.entry;
  }

  public async remove(): Promise<CharacterInventoryEntry | null> {
    const entry = this.entry;
    this.entry = null;
    return entry;
  }
}

describe("CharacterInventoryService", () => {
  it("adds and updates a validated inventory entry", async () => {
    const service = new CharacterInventoryService(new MemoryInventoryRepository());
    const added = await service.add("campaign-1", "character-1", {
      itemId: "item-1",
      quantity: 2,
      equipped: true,
      notes: "Am Gürtel",
    });
    expect(added).toMatchObject({ quantity: 2, equipped: true });
    await expect(
      service.update("campaign-1", "character-1", added.id, {
        quantity: 3,
        equipped: false,
        notes: "Im Rucksack",
      }),
    ).resolves.toMatchObject({ quantity: 3, equipped: false });
  });

  it("rejects invalid quantities and missing entries", async () => {
    const service = new CharacterInventoryService(new MemoryInventoryRepository());
    await expect(
      service.add("campaign-1", "character-1", {
        itemId: "item-1",
        quantity: 0,
        equipped: false,
        notes: "",
      }),
    ).rejects.toThrow();
    await expect(
      service.remove("campaign-1", "character-1", "inventory-1"),
    ).rejects.toBeInstanceOf(CharacterInventoryNotFoundError);
  });
});
