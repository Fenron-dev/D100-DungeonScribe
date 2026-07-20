import type {
  CharacterInventoryDraft,
  CharacterInventoryEntry,
  CharacterInventoryUpdate,
} from "@/domain/character-inventory";

export interface CharacterInventoryRepository {
  listByCampaign(campaignId: string): Promise<CharacterInventoryEntry[]>;
  listByCharacter(
    campaignId: string,
    characterId: string,
  ): Promise<CharacterInventoryEntry[]>;
  add(
    campaignId: string,
    characterId: string,
    draft: CharacterInventoryDraft,
  ): Promise<CharacterInventoryEntry | null>;
  update(
    campaignId: string,
    characterId: string,
    entryId: string,
    draft: CharacterInventoryUpdate,
  ): Promise<CharacterInventoryEntry | null>;
  remove(
    campaignId: string,
    characterId: string,
    entryId: string,
  ): Promise<CharacterInventoryEntry | null>;
}
