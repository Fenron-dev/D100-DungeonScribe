import type { Character, CharacterDraft } from "@/domain/character";

export interface CharacterRepository {
  create(campaignId: string, draft: CharacterDraft): Promise<Character | null>;
  findById(campaignId: string, characterId: string): Promise<Character | null>;
  listByCampaign(campaignId: string): Promise<Character[]>;
  update(
    campaignId: string,
    characterId: string,
    draft: CharacterDraft,
  ): Promise<Character | null>;
}
