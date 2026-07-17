import { z } from "zod";
import type { StoryThread, StoryThreadDraft } from "@/domain/story-thread";
import type { PrismaClient } from "@/generated/prisma/client";
import type { StoryThreadRepository } from "@/repositories/story-thread-repository";
import { storyThreadDraftSchema } from "@/schemas/story-thread";

type StoryThreadRow = Awaited<
  ReturnType<PrismaClient["storyThread"]["findUnique"]>
>;

const persistedIdsSchema = z.array(z.string());
const persistedDevelopmentsSchema = z.array(z.string());

function mapStoryThread(row: NonNullable<StoryThreadRow>): StoryThread {
  const draft = storyThreadDraftSchema.parse({
    title: row.title,
    premise: row.premise,
    description: row.description,
    status: row.status,
    urgency: row.urgency,
    progressCurrent: row.progressCurrent,
    progressTarget: row.progressTarget,
    relatedEntityIds: persistedIdsSchema.parse(row.relatedEntityIds),
    nextPossibleDevelopments: persistedDevelopmentsSchema.parse(
      row.nextPossibleDevelopments,
    ),
  });
  return {
    id: row.id,
    campaignId: row.campaignId,
    ...draft,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaStoryThreadRepository implements StoryThreadRepository {
  public constructor(private readonly client: PrismaClient) {}

  private async referencesExist(
    campaignId: string,
    relatedEntityIds: string[],
  ): Promise<boolean> {
    const [campaign, entityCount] = await Promise.all([
      this.client.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true },
      }),
      this.client.worldEntity.count({
        where: { campaignId, id: { in: relatedEntityIds } },
      }),
    ]);
    return campaign !== null && entityCount === relatedEntityIds.length;
  }

  public async create(
    campaignId: string,
    draft: StoryThreadDraft,
  ): Promise<StoryThread | null> {
    if (!(await this.referencesExist(campaignId, draft.relatedEntityIds))) {
      return null;
    }
    return this.client.$transaction(async (transaction) => {
      const thread = await transaction.storyThread.create({
        data: { campaignId, ...draft },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "THREAD_CREATED",
          summary: "Handlungsstrang erstellt",
          payload: {
            storyThreadId: thread.id,
            title: thread.title,
            urgency: thread.urgency,
          },
          source: "manual",
          reversible: false,
        },
      });
      return mapStoryThread(thread);
    });
  }

  public async findById(
    campaignId: string,
    threadId: string,
  ): Promise<StoryThread | null> {
    const thread = await this.client.storyThread.findFirst({
      where: { id: threadId, campaignId },
    });
    return thread ? mapStoryThread(thread) : null;
  }

  public async listByCampaign(campaignId: string): Promise<StoryThread[]> {
    const threads = await this.client.storyThread.findMany({
      where: { campaignId },
      orderBy: [{ status: "asc" }, { urgency: "desc" }, { updatedAt: "desc" }],
    });
    return threads.map(mapStoryThread);
  }

  public async update(
    campaignId: string,
    threadId: string,
    draft: StoryThreadDraft,
  ): Promise<StoryThread | null> {
    const existing = await this.client.storyThread.findFirst({
      where: { id: threadId, campaignId },
    });
    if (
      !existing ||
      !(await this.referencesExist(campaignId, draft.relatedEntityIds))
    ) {
      return null;
    }
    return this.client.$transaction(async (transaction) => {
      const thread = await transaction.storyThread.update({
        where: { id: threadId },
        data: draft,
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "THREAD_UPDATED",
          summary: "Handlungsstrang bearbeitet",
          payload: {
            storyThreadId: thread.id,
            previousTitle: existing.title,
            title: thread.title,
            previousStatus: existing.status,
            status: thread.status,
            progressCurrent: thread.progressCurrent,
            progressTarget: thread.progressTarget,
          },
          source: "manual",
          reversible: true,
        },
      });
      return mapStoryThread(thread);
    });
  }
}
