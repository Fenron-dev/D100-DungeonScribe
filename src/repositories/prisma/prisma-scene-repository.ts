import { z } from "zod";
import type { Scene, SceneCompletion, SceneDraft } from "@/domain/scene";
import type { PrismaClient } from "@/generated/prisma/client";
import type { SceneRepository } from "@/repositories/scene-repository";
import { sceneDraftSchema, sceneStatusSchema } from "@/schemas/scene";
import { campaignTensionSchema } from "@/schemas/campaign";

type SceneRow = Awaited<ReturnType<PrismaClient["scene"]["findUnique"]>>;

const persistedIdsSchema = z.array(z.string());

function mapScene(row: NonNullable<SceneRow>): Scene {
  const draft = sceneDraftSchema.parse({
    title: row.title,
    locationId: row.locationId,
    expectedSetup: row.expectedSetup,
    actualSetup: row.actualSetup,
    objective: row.objective,
    participantCharacterIds: persistedIdsSchema.parse(
      row.participantCharacterIds,
    ),
    participantEntityIds: persistedIdsSchema.parse(row.participantEntityIds),
    relevantThreadIds: persistedIdsSchema.parse(row.relevantThreadIds),
  });
  return {
    id: row.id,
    campaignId: row.campaignId,
    ...draft,
    status: sceneStatusSchema.parse(row.status),
    summary: row.summary,
    startedAtReal: row.startedAtReal,
    endedAtReal: row.endedAtReal,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaSceneRepository implements SceneRepository {
  public constructor(private readonly client: PrismaClient) {}

  private async referencesExist(
    campaignId: string,
    draft: SceneDraft,
  ): Promise<boolean> {
    const entityIds = [
      ...draft.participantEntityIds,
      ...(draft.locationId ? [draft.locationId] : []),
    ];
    const [campaign, characterCount, entityCount, threadCount, location] =
      await Promise.all([
        this.client.campaign.findFirst({
          where: { id: campaignId, status: "active" },
          select: { id: true },
        }),
        this.client.character.count({
          where: { campaignId, id: { in: draft.participantCharacterIds } },
        }),
        this.client.worldEntity.count({
          where: { campaignId, id: { in: entityIds } },
        }),
        this.client.storyThread.count({
          where: { campaignId, id: { in: draft.relevantThreadIds } },
        }),
        draft.locationId
          ? this.client.worldEntity.findFirst({
              where: {
                id: draft.locationId,
                campaignId,
                type: "location",
              },
              select: { id: true },
            })
          : Promise.resolve(null),
      ]);
    return (
      campaign !== null &&
      characterCount === draft.participantCharacterIds.length &&
      entityCount === new Set(entityIds).size &&
      threadCount === draft.relevantThreadIds.length &&
      (draft.locationId === null || location !== null)
    );
  }

  public async create(
    campaignId: string,
    draft: SceneDraft,
  ): Promise<Scene | null> {
    if (!(await this.referencesExist(campaignId, draft))) return null;
    return this.client.$transaction(async (transaction) => {
      const scene = await transaction.scene.create({
        data: { campaignId, ...draft, status: "active" },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_STARTED",
          summary: "Szene begonnen",
          payload: {
            sceneId: scene.id,
            title: scene.title,
            locationId: scene.locationId,
          },
          source: "manual",
          reversible: false,
        },
      });
      return mapScene(scene);
    });
  }

  public async findById(
    campaignId: string,
    sceneId: string,
  ): Promise<Scene | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId },
    });
    return scene ? mapScene(scene) : null;
  }

  public async findActive(campaignId: string): Promise<Scene | null> {
    const scene = await this.client.scene.findFirst({
      where: { campaignId, status: "active" },
    });
    return scene ? mapScene(scene) : null;
  }

  public async listByCampaign(campaignId: string): Promise<Scene[]> {
    const scenes = await this.client.scene.findMany({
      where: { campaignId },
      orderBy: [{ status: "asc" }, { startedAtReal: "desc" }],
    });
    return scenes.map(mapScene);
  }

  public async findCampaignTension(campaignId: string): Promise<number | null> {
    const campaign = await this.client.campaign.findFirst({
      where: { id: campaignId, status: "active" },
      select: { tension: true },
    });
    return campaign ? campaignTensionSchema.parse(campaign.tension) : null;
  }

  public async complete(
    campaignId: string,
    sceneId: string,
    completion: SceneCompletion,
    endedAtReal: Date,
  ): Promise<Scene | null> {
    const existing = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
    });
    if (!existing) return null;
    return this.client.$transaction(async (transaction) => {
      const scene = await transaction.scene.update({
        where: { id: sceneId },
        data: { status: "completed", summary: completion.summary, endedAtReal },
      });
      if (completion.tension.next !== completion.tension.previous) {
        await transaction.campaign.update({
          where: { id: campaignId },
          data: { tension: completion.tension.next },
        });
        await transaction.campaignEvent.create({
          data: {
            campaignId,
            eventType: "TENSION_CHANGED",
            summary: "Spannung angepasst",
            payload: {
              sceneId,
              previous: completion.tension.previous,
              next: completion.tension.next,
              adjustment: completion.tension.adjustment,
            },
            source: "manual",
            reversible: false,
          },
        });
      }
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_COMPLETED",
          summary: "Szene abgeschlossen",
          payload: { sceneId: scene.id, title: scene.title },
          source: "manual",
          reversible: false,
        },
      });
      return mapScene(scene);
    });
  }
}
