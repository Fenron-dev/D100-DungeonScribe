import type { StoryThread, StoryThreadDraft } from "@/domain/story-thread";

export interface StoryThreadRepository {
  create(campaignId: string, draft: StoryThreadDraft): Promise<StoryThread | null>;
  findById(campaignId: string, threadId: string): Promise<StoryThread | null>;
  listByCampaign(campaignId: string): Promise<StoryThread[]>;
  update(
    campaignId: string,
    threadId: string,
    draft: StoryThreadDraft,
  ): Promise<StoryThread | null>;
}
