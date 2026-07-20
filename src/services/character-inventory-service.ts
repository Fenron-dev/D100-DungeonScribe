import type { CharacterInventoryEntry } from "@/domain/character-inventory";
import type { CharacterInventoryRepository } from "@/repositories/character-inventory-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { characterIdSchema } from "@/schemas/character";
import {
  characterInventoryDraftSchema,
  characterInventoryEntryIdSchema,
  characterInventoryUpdateSchema,
} from "@/schemas/character-inventory";

export class CharacterInventoryNotFoundError extends Error {
  public constructor() {
    super("Inventory entry, item, character, or campaign not found.");
    this.name = "CharacterInventoryNotFoundError";
  }
}

export class CharacterInventoryService {
  public constructor(private readonly repository: CharacterInventoryRepository) {}

  public async listCampaign(campaignId: string): Promise<CharacterInventoryEntry[]> {
    return this.repository.listByCampaign(campaignIdSchema.parse(campaignId));
  }

  public async list(
    campaignId: string,
    characterId: string,
  ): Promise<CharacterInventoryEntry[]> {
    return this.repository.listByCharacter(
      campaignIdSchema.parse(campaignId),
      characterIdSchema.parse(characterId),
    );
  }

  public async add(
    campaignId: string,
    characterId: string,
    input: unknown,
  ): Promise<CharacterInventoryEntry> {
    const entry = await this.repository.add(
      campaignIdSchema.parse(campaignId),
      characterIdSchema.parse(characterId),
      characterInventoryDraftSchema.parse(input),
    );
    if (!entry) throw new CharacterInventoryNotFoundError();
    return entry;
  }

  public async update(
    campaignId: string,
    characterId: string,
    entryId: string,
    input: unknown,
  ): Promise<CharacterInventoryEntry> {
    const entry = await this.repository.update(
      campaignIdSchema.parse(campaignId),
      characterIdSchema.parse(characterId),
      characterInventoryEntryIdSchema.parse(entryId),
      characterInventoryUpdateSchema.parse(input),
    );
    if (!entry) throw new CharacterInventoryNotFoundError();
    return entry;
  }

  public async remove(
    campaignId: string,
    characterId: string,
    entryId: string,
  ): Promise<CharacterInventoryEntry> {
    const entry = await this.repository.remove(
      campaignIdSchema.parse(campaignId),
      characterIdSchema.parse(characterId),
      characterInventoryEntryIdSchema.parse(entryId),
    );
    if (!entry) throw new CharacterInventoryNotFoundError();
    return entry;
  }
}
