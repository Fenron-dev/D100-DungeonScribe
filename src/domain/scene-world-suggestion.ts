import type { WorldEntityType } from "@/domain/world-entity";

export const sceneWorldSuggestionStatuses = ["pending", "accepted", "dismissed"] as const;

export type SceneWorldSuggestionStatus =
  (typeof sceneWorldSuggestionStatuses)[number];

export interface SceneWorldSuggestionDraft {
  type: WorldEntityType;
  name: string;
  summary: string;
}

export interface SceneWorldSuggestion extends SceneWorldSuggestionDraft {
  id: string;
  campaignId: string;
  sceneId: string;
  messageId: string;
  status: SceneWorldSuggestionStatus;
  createdEntityId: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}
