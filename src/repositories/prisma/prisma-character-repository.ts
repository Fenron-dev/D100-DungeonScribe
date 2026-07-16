import type { Character, CharacterDraft } from "@/domain/character";
import type { PrismaClient } from "@/generated/prisma/client";
import type { CharacterRepository } from "@/repositories/character-repository";
import {
  characterDraftSchema,
  characterTraitsSchema,
} from "@/schemas/character";

type CharacterRow = Awaited<
  ReturnType<PrismaClient["character"]["findUnique"]>
>;

function mapCharacter(row: NonNullable<CharacterRow>): Character {
  const validated = characterDraftSchema.parse({
    name: row.name,
    concept: row.concept,
    archetype: row.archetype,
    traits: characterTraitsSchema.parse(row.traits),
    flaw: row.flaw,
    notes: row.notes,
  });

  return {
    id: row.id,
    campaignId: row.campaignId,
    ...validated,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaCharacterRepository implements CharacterRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async create(
    campaignId: string,
    draft: CharacterDraft,
  ): Promise<Character | null> {
    const campaign = await this.client.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true },
    });
    if (!campaign) {
      return null;
    }

    return this.client.$transaction(async (transaction) => {
      const character = await transaction.character.create({
        data: { campaignId, ...draft },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "CHARACTER_CREATED",
          summary: "Charakter erstellt",
          payload: { characterId: character.id, name: character.name },
          source: "player",
          reversible: false,
        },
      });

      return mapCharacter(character);
    });
  }

  public async findById(
    campaignId: string,
    characterId: string,
  ): Promise<Character | null> {
    const character = await this.client.character.findFirst({
      where: { id: characterId, campaignId },
    });
    return character ? mapCharacter(character) : null;
  }

  public async listByCampaign(campaignId: string): Promise<Character[]> {
    const characters = await this.client.character.findMany({
      where: { campaignId },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    });
    return characters.map(mapCharacter);
  }

  public async update(
    campaignId: string,
    characterId: string,
    draft: CharacterDraft,
  ): Promise<Character | null> {
    const existing = await this.client.character.findFirst({
      where: { id: characterId, campaignId },
    });
    if (!existing) {
      return null;
    }

    return this.client.$transaction(async (transaction) => {
      const character = await transaction.character.update({
        where: { id: characterId },
        data: draft,
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "CHARACTER_UPDATED",
          summary: "Charakter bearbeitet",
          payload: {
            characterId: character.id,
            previousName: existing.name,
            name: character.name,
          },
          source: "player",
          reversible: true,
        },
      });

      return mapCharacter(character);
    });
  }
}
