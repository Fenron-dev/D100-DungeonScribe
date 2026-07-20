import type {
  CharacterInventoryDraft,
  CharacterInventoryEntry,
  CharacterInventoryUpdate,
} from "@/domain/character-inventory";
import type { PrismaClient } from "@/generated/prisma/client";
import type { CharacterInventoryRepository } from "@/repositories/character-inventory-repository";

interface InventoryRow {
  id: string;
  campaignId: string;
  characterId: string;
  itemId: string;
  quantity: number;
  equipped: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  item: { name: string; summary: string };
}

const inventoryInclude = {
  item: { select: { name: true, summary: true } },
} as const;

function mapEntry(row: InventoryRow): CharacterInventoryEntry {
  return {
    id: row.id,
    campaignId: row.campaignId,
    characterId: row.characterId,
    itemId: row.itemId,
    quantity: row.quantity,
    equipped: row.equipped,
    notes: row.notes,
    itemName: row.item.name,
    itemSummary: row.item.summary,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaCharacterInventoryRepository
  implements CharacterInventoryRepository
{
  public constructor(private readonly client: PrismaClient) {}

  public async listByCampaign(
    campaignId: string,
  ): Promise<CharacterInventoryEntry[]> {
    const entries = await this.client.characterInventoryEntry.findMany({
      where: { campaignId },
      include: inventoryInclude,
      orderBy: [{ equipped: "desc" }, { updatedAt: "desc" }],
    });
    return entries.map(mapEntry);
  }

  public async listByCharacter(
    campaignId: string,
    characterId: string,
  ): Promise<CharacterInventoryEntry[]> {
    const entries = await this.client.characterInventoryEntry.findMany({
      where: { campaignId, characterId },
      include: inventoryInclude,
      orderBy: [{ equipped: "desc" }, { updatedAt: "desc" }],
    });
    return entries.map(mapEntry);
  }

  public async add(
    campaignId: string,
    characterId: string,
    draft: CharacterInventoryDraft,
  ): Promise<CharacterInventoryEntry | null> {
    const [character, item, duplicate] = await Promise.all([
      this.client.character.findFirst({ where: { id: characterId, campaignId } }),
      this.client.worldEntity.findFirst({
        where: { id: draft.itemId, campaignId, type: "item" },
      }),
      this.client.characterInventoryEntry.findUnique({
        where: { characterId_itemId: { characterId, itemId: draft.itemId } },
      }),
    ]);
    if (!character || !item || duplicate) return null;
    return this.client.$transaction(async (transaction) => {
      const entry = await transaction.characterInventoryEntry.create({
        data: { campaignId, characterId, ...draft },
        include: inventoryInclude,
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "INVENTORY_ITEM_ADDED",
          summary: "Gegenstand zum Inventar hinzugefügt",
          payload: {
            characterId,
            inventoryEntryId: entry.id,
            itemId: entry.itemId,
            quantity: entry.quantity,
            equipped: entry.equipped,
          },
          source: "manual",
          reversible: false,
        },
      });
      return mapEntry(entry);
    });
  }

  public async update(
    campaignId: string,
    characterId: string,
    entryId: string,
    draft: CharacterInventoryUpdate,
  ): Promise<CharacterInventoryEntry | null> {
    const existing = await this.client.characterInventoryEntry.findFirst({
      where: { id: entryId, campaignId, characterId },
    });
    if (!existing) return null;
    return this.client.$transaction(async (transaction) => {
      const entry = await transaction.characterInventoryEntry.update({
        where: { id: entryId },
        data: draft,
        include: inventoryInclude,
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "INVENTORY_ITEM_UPDATED",
          summary: "Inventargegenstand geändert",
          payload: {
            characterId,
            inventoryEntryId: entry.id,
            itemId: entry.itemId,
            previousQuantity: existing.quantity,
            quantity: entry.quantity,
            previousEquipped: existing.equipped,
            equipped: entry.equipped,
          },
          source: "manual",
          reversible: true,
        },
      });
      return mapEntry(entry);
    });
  }

  public async remove(
    campaignId: string,
    characterId: string,
    entryId: string,
  ): Promise<CharacterInventoryEntry | null> {
    const existing = await this.client.characterInventoryEntry.findFirst({
      where: { id: entryId, campaignId, characterId },
      include: inventoryInclude,
    });
    if (!existing) return null;
    return this.client.$transaction(async (transaction) => {
      await transaction.characterInventoryEntry.delete({ where: { id: entryId } });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "INVENTORY_ITEM_REMOVED",
          summary: "Gegenstand aus Inventar entfernt",
          payload: {
            characterId,
            inventoryEntryId: existing.id,
            itemId: existing.itemId,
            quantity: existing.quantity,
          },
          source: "manual",
          reversible: false,
        },
      });
      return mapEntry(existing);
    });
  }
}
