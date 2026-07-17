import { describe, expect, it } from "vitest";
import type { StoryThread, StoryThreadDraft } from "@/domain/story-thread";
import type { StoryThreadRepository } from "@/repositories/story-thread-repository";
import {
  StoryThreadNotFoundError,
  StoryThreadService,
} from "./story-thread-service";

class InMemoryStoryThreadRepository implements StoryThreadRepository {
  private thread: StoryThread | null = null;

  public async create(campaignId: string, draft: StoryThreadDraft) {
    if (campaignId === "missing") return null;
    const now = new Date("2026-07-17T15:00:00.000Z");
    this.thread = {
      id: "thread-1",
      campaignId,
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    return this.thread;
  }

  public async findById(campaignId: string, threadId: string) {
    return this.thread?.campaignId === campaignId && this.thread.id === threadId
      ? this.thread
      : null;
  }

  public async listByCampaign(campaignId: string) {
    return this.thread?.campaignId === campaignId ? [this.thread] : [];
  }

  public async update(
    campaignId: string,
    threadId: string,
    draft: StoryThreadDraft,
  ) {
    const thread = await this.findById(campaignId, threadId);
    if (!thread) return null;
    this.thread = { ...thread, ...draft };
    return this.thread;
  }
}

const draft = {
  title: " Die wiedergekehrte Straße ",
  premise: " Eine verschwundene Straße ist wieder aufgetaucht. ",
  description: "",
  status: "open",
  urgency: 4,
  progressCurrent: 1,
  progressTarget: 4,
  relatedEntityIds: ["entity-1"],
  nextPossibleDevelopments: [" Der Nebel gibt einen Weg frei. "],
};

describe("StoryThreadService", () => {
  it("creates, lists, and advances normalized story threads", async () => {
    const service = new StoryThreadService(new InMemoryStoryThreadRepository());
    const thread = await service.create("campaign-1", draft);
    const updated = await service.update("campaign-1", thread.id, {
      ...draft,
      progressCurrent: 2,
    });

    expect(thread).toMatchObject({
      title: "Die wiedergekehrte Straße",
      description: null,
    });
    expect(updated.progressCurrent).toBe(2);
    await expect(service.list("campaign-1")).resolves.toHaveLength(1);
  });

  it("rejects missing campaign and thread references", async () => {
    const service = new StoryThreadService(new InMemoryStoryThreadRepository());

    await expect(service.create("missing", draft)).rejects.toBeInstanceOf(
      StoryThreadNotFoundError,
    );
    await expect(
      service.update("campaign-1", "missing", draft),
    ).rejects.toBeInstanceOf(StoryThreadNotFoundError);
  });
});
