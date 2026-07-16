import { describe, expect, it } from "vitest";
import type { Character, CharacterDraft } from "@/domain/character";
import type { CharacterRepository } from "@/repositories/character-repository";
import { CharacterNotFoundError, CharacterService } from "./character-service";

class InMemoryCharacterRepository implements CharacterRepository {
  private character: Character | null = null;

  public async create(
    campaignId: string,
    draft: CharacterDraft,
  ): Promise<Character | null> {
    if (campaignId === "missing") {
      return null;
    }
    const now = new Date("2026-07-16T23:00:00.000Z");
    this.character = {
      id: "character-1",
      campaignId,
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    return this.character;
  }

  public async findById(
    campaignId: string,
    characterId: string,
  ): Promise<Character | null> {
    return this.character?.campaignId === campaignId &&
      this.character.id === characterId
      ? this.character
      : null;
  }

  public async listByCampaign(campaignId: string): Promise<Character[]> {
    return this.character?.campaignId === campaignId ? [this.character] : [];
  }

  public async update(
    campaignId: string,
    characterId: string,
    draft: CharacterDraft,
  ): Promise<Character | null> {
    const character = await this.findById(campaignId, characterId);
    if (!character) {
      return null;
    }
    this.character = { ...character, ...draft };
    return this.character;
  }
}

const draft = {
  name: " Elara Venn ",
  concept: " Ehemalige Hofmagierin ",
  archetype: "insightful",
  traits: [" Gebildet "],
  flaw: "",
  notes: "",
};

describe("CharacterService", () => {
  it("creates, lists, and updates normalized characters", async () => {
    const service = new CharacterService(new InMemoryCharacterRepository());
    const character = await service.create("campaign-1", draft);
    const updated = await service.update("campaign-1", character.id, {
      ...draft,
      name: "Elara aus dem Nebel",
    });

    expect(character).toMatchObject({ name: "Elara Venn", flaw: null });
    expect(updated.name).toBe("Elara aus dem Nebel");
    await expect(service.list("campaign-1")).resolves.toHaveLength(1);
  });

  it("rejects missing campaign and character references", async () => {
    const service = new CharacterService(new InMemoryCharacterRepository());

    await expect(service.create("missing", draft)).rejects.toBeInstanceOf(
      CharacterNotFoundError,
    );
    await expect(
      service.update("campaign-1", "missing", draft),
    ).rejects.toBeInstanceOf(CharacterNotFoundError);
  });
});
