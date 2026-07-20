import type { SceneWorldSuggestion } from "@/domain/scene-world-suggestion";
import type { WorldEntityDraft, WorldEntityType } from "@/domain/world-entity";
import type { PrismaClient } from "@/generated/prisma/client";
import type { SceneWorldSuggestionRepository } from "@/repositories/scene-world-suggestion-repository";
import {
  sceneWorldSuggestionDraftSchema,
  sceneWorldSuggestionStatusSchema,
} from "@/schemas/scene-world-suggestion";
import { worldEntityDraftSchema } from "@/schemas/world-entity";

type SuggestionRow = Awaited<
  ReturnType<PrismaClient["sceneWorldSuggestion"]["findUnique"]>
>;

function mapSuggestion(row: NonNullable<SuggestionRow>): SceneWorldSuggestion {
  const draft = sceneWorldSuggestionDraftSchema.parse(row);
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    messageId: row.messageId,
    ...draft,
    status: sceneWorldSuggestionStatusSchema.parse(row.status),
    createdEntityId: row.createdEntityId,
    createdAt: row.createdAt,
    resolvedAt: row.resolvedAt,
  };
}

function detailsFor(type: WorldEntityType): WorldEntityDraft["details"] {
  switch (type) {
    case "npc":
      return { type, role: null, motivation: null };
    case "location":
      return { type, region: null, atmosphere: null };
    case "faction":
      return { type, goal: null, influence: null };
    case "item":
      return { type, purpose: null, rarity: null };
  }
}

export class PrismaSceneWorldSuggestionRepository
  implements SceneWorldSuggestionRepository
{
  public constructor(private readonly client: PrismaClient) {}

  public async listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneWorldSuggestion[]> {
    const suggestions = await this.client.sceneWorldSuggestion.findMany({
      where: { campaignId, sceneId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });
    return suggestions.map(mapSuggestion);
  }

  public async accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion | null> {
    return this.client.$transaction(async (transaction) => {
      const suggestion = await transaction.sceneWorldSuggestion.findFirst({
        where: { id: suggestionId, campaignId, sceneId, status: "pending" },
      });
      if (!suggestion) return null;
      const draft = sceneWorldSuggestionDraftSchema.parse(suggestion);
      const entityDraft = worldEntityDraftSchema.parse({
        ...draft,
        description: null,
        tags: [],
        status: "active",
        details: detailsFor(draft.type),
      });
      const entity = await transaction.worldEntity.create({
        data: { campaignId, ...entityDraft },
      });
      const resolved = await transaction.sceneWorldSuggestion.update({
        where: { id: suggestion.id },
        data: {
          status: "accepted",
          createdEntityId: entity.id,
          resolvedAt: new Date(),
        },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ENTITY_CREATED",
          summary: "KI-Vorschlag ins Weltregister übernommen",
          payload: {
            entityId: entity.id,
            suggestionId: suggestion.id,
            sceneId,
            type: entity.type,
            name: entity.name,
          },
          source: "player",
          reversible: false,
        },
      });
      return mapSuggestion(resolved);
    });
  }

  public async dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion | null> {
    const suggestion = await this.client.sceneWorldSuggestion.findFirst({
      where: { id: suggestionId, campaignId, sceneId, status: "pending" },
    });
    if (!suggestion) return null;
    const resolved = await this.client.sceneWorldSuggestion.update({
      where: { id: suggestion.id },
      data: { status: "dismissed", resolvedAt: new Date() },
    });
    return mapSuggestion(resolved);
  }
}
