import type { SceneStateSuggestion } from "@/domain/scene-state-suggestion";
import type { PrismaClient } from "@/generated/prisma/client";
import type { SceneStateSuggestionRepository } from "@/repositories/scene-state-suggestion-repository";
import {
  sceneStateSuggestionDraftSchema,
  sceneStateSuggestionResolutionSchema,
  sceneStateSuggestionStatusSchema,
  type SceneStateSuggestionResolution,
} from "@/schemas/scene-state-suggestion";

type SuggestionRow = Awaited<
  ReturnType<PrismaClient["sceneStateSuggestion"]["findUnique"]>
>;

function mapSuggestion(row: NonNullable<SuggestionRow>): SceneStateSuggestion {
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    messageId: row.messageId,
    ...sceneStateSuggestionDraftSchema.parse(row),
    status: sceneStateSuggestionStatusSchema.parse(row.status),
    createdRecordId: row.createdRecordId,
    createdAt: row.createdAt,
    resolvedAt: row.resolvedAt,
  };
}

export class PrismaSceneStateSuggestionRepository
  implements SceneStateSuggestionRepository
{
  public constructor(private readonly client: PrismaClient) {}

  public async listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneStateSuggestion[]> {
    const suggestions = await this.client.sceneStateSuggestion.findMany({
      where: { campaignId, sceneId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });
    return suggestions.map(mapSuggestion);
  }

  public async accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
    input: SceneStateSuggestionResolution,
  ): Promise<SceneStateSuggestion | null> {
    const resolution = sceneStateSuggestionResolutionSchema.parse(input);
    return this.client.$transaction(async (transaction) => {
      const suggestion = await transaction.sceneStateSuggestion.findFirst({
        where: { id: suggestionId, campaignId, sceneId, status: "pending" },
      });
      if (!suggestion || suggestion.kind !== resolution.kind) return null;

      const entityIds = resolution.draft.relatedEntityIds;
      const entityCount = await transaction.worldEntity.count({
        where: { campaignId, id: { in: entityIds } },
      });
      if (entityCount !== entityIds.length) return null;

      let createdRecordId: string;
      if (resolution.kind === "knowledge") {
        const characterCount = await transaction.character.count({
          where: {
            campaignId,
            id: { in: resolution.draft.knownByCharacterIds },
          },
        });
        if (characterCount !== resolution.draft.knownByCharacterIds.length) {
          return null;
        }
        const entry = await transaction.knowledgeEntry.create({
          data: { campaignId, ...resolution.draft },
        });
        const event = await transaction.campaignEvent.create({
          data: {
            campaignId,
            eventType: "KNOWLEDGE_DISCOVERED",
            summary: "KI-Vorschlag als Wissen übernommen",
            payload: {
              knowledgeEntryId: entry.id,
              suggestionId,
              sceneId,
              title: entry.title,
              type: entry.type,
              truthStatus: entry.truthStatus,
            },
            source: "player",
            reversible: false,
          },
        });
        await transaction.knowledgeEntry.update({
          where: { id: entry.id },
          data: { sourceEventId: event.id },
        });
        createdRecordId = entry.id;
      } else {
        const thread = await transaction.storyThread.create({
          data: { campaignId, ...resolution.draft },
        });
        await transaction.campaignEvent.create({
          data: {
            campaignId,
            eventType: "THREAD_CREATED",
            summary: "KI-Vorschlag als Handlungsstrang übernommen",
            payload: {
              storyThreadId: thread.id,
              suggestionId,
              sceneId,
              title: thread.title,
              urgency: thread.urgency,
            },
            source: "player",
            reversible: false,
          },
        });
        createdRecordId = thread.id;
      }

      const resolved = await transaction.sceneStateSuggestion.update({
        where: { id: suggestion.id },
        data: {
          status: "accepted",
          createdRecordId,
          resolvedAt: new Date(),
          title: resolution.draft.title,
          content:
            resolution.kind === "knowledge"
              ? resolution.draft.content
              : resolution.draft.premise,
        },
      });
      return mapSuggestion(resolved);
    });
  }

  public async dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneStateSuggestion | null> {
    const suggestion = await this.client.sceneStateSuggestion.findFirst({
      where: { id: suggestionId, campaignId, sceneId, status: "pending" },
    });
    if (!suggestion) return null;
    const resolved = await this.client.sceneStateSuggestion.update({
      where: { id: suggestion.id },
      data: { status: "dismissed", resolvedAt: new Date() },
    });
    return mapSuggestion(resolved);
  }
}
