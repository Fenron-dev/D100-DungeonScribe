export const storyThreadStatuses = [
  "open",
  "dormant",
  "resolved",
  "failed",
] as const;

export type StoryThreadStatus = (typeof storyThreadStatuses)[number];

export interface StoryThreadDraft {
  title: string;
  premise: string;
  description: string | null;
  status: StoryThreadStatus;
  urgency: number;
  progressCurrent: number;
  progressTarget: number;
  relatedEntityIds: string[];
  nextPossibleDevelopments: string[];
}

export interface StoryThread extends StoryThreadDraft {
  id: string;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}
