import type { StoryThread } from "@/domain/story-thread";
import type { StoryThreadRepository } from "@/repositories/story-thread-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import {
  storyThreadDraftSchema,
  storyThreadIdSchema,
} from "@/schemas/story-thread";

export class StoryThreadNotFoundError extends Error {
  public constructor() {
    super("Story thread, campaign, or related world entity not found.");
    this.name = "StoryThreadNotFoundError";
  }
}

export class StoryThreadService {
  public constructor(private readonly repository: StoryThreadRepository) {}

  public async create(campaignId: string, input: unknown): Promise<StoryThread> {
    const thread = await this.repository.create(
      campaignIdSchema.parse(campaignId),
      storyThreadDraftSchema.parse(input),
    );
    if (!thread) throw new StoryThreadNotFoundError();
    return thread;
  }

  public async findById(
    campaignId: string,
    threadId: string,
  ): Promise<StoryThread | null> {
    return this.repository.findById(
      campaignIdSchema.parse(campaignId),
      storyThreadIdSchema.parse(threadId),
    );
  }

  public async list(campaignId: string): Promise<StoryThread[]> {
    return this.repository.listByCampaign(campaignIdSchema.parse(campaignId));
  }

  public async update(
    campaignId: string,
    threadId: string,
    input: unknown,
  ): Promise<StoryThread> {
    const thread = await this.repository.update(
      campaignIdSchema.parse(campaignId),
      storyThreadIdSchema.parse(threadId),
      storyThreadDraftSchema.parse(input),
    );
    if (!thread) throw new StoryThreadNotFoundError();
    return thread;
  }
}
