export const sceneStatuses = ["active", "completed"] as const;

export type SceneStatus = (typeof sceneStatuses)[number];

export interface SceneDraft {
  title: string;
  locationId: string | null;
  expectedSetup: string;
  actualSetup: string;
  objective: string | null;
  participantCharacterIds: string[];
  participantEntityIds: string[];
  relevantThreadIds: string[];
}

export interface Scene extends SceneDraft {
  id: string;
  campaignId: string;
  status: SceneStatus;
  summary: string | null;
  startedAtReal: Date;
  endedAtReal: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
