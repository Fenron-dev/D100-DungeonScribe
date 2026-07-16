import type { Character } from "@/domain/character";
import type { CharacterRepository } from "@/repositories/character-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { characterDraftSchema, characterIdSchema } from "@/schemas/character";

export class CharacterNotFoundError extends Error {
  public constructor() {
    super("Character or campaign not found.");
    this.name = "CharacterNotFoundError";
  }
}

export class CharacterService {
  public constructor(private readonly repository: CharacterRepository) {}

  public async create(campaignId: string, input: unknown): Promise<Character> {
    const character = await this.repository.create(
      campaignIdSchema.parse(campaignId),
      characterDraftSchema.parse(input),
    );
    if (!character) {
      throw new CharacterNotFoundError();
    }
    return character;
  }

  public async findById(
    campaignId: string,
    characterId: string,
  ): Promise<Character | null> {
    return this.repository.findById(
      campaignIdSchema.parse(campaignId),
      characterIdSchema.parse(characterId),
    );
  }

  public async list(campaignId: string): Promise<Character[]> {
    return this.repository.listByCampaign(campaignIdSchema.parse(campaignId));
  }

  public async update(
    campaignId: string,
    characterId: string,
    input: unknown,
  ): Promise<Character> {
    const character = await this.repository.update(
      campaignIdSchema.parse(campaignId),
      characterIdSchema.parse(characterId),
      characterDraftSchema.parse(input),
    );
    if (!character) {
      throw new CharacterNotFoundError();
    }
    return character;
  }
}
