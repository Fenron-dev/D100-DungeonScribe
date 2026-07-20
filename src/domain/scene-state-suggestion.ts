export const sceneStateSuggestionKinds = ["knowledge", "thread"] as const;
export const sceneStateSuggestionStatuses = ["pending", "accepted", "dismissed"] as const;

export type SceneStateSuggestionKind =
  (typeof sceneStateSuggestionKinds)[number];
export type SceneStateSuggestionStatus =
  (typeof sceneStateSuggestionStatuses)[number];

export interface SceneStateSuggestionDraft {
  kind: SceneStateSuggestionKind;
  title: string;
  content: string;
}

export interface SceneStateSuggestion extends SceneStateSuggestionDraft {
  id: string;
  campaignId: string;
  sceneId: string;
  messageId: string;
  status: SceneStateSuggestionStatus;
  createdRecordId: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}
