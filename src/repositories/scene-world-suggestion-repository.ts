import type { SceneWorldSuggestion } from "@/domain/scene-world-suggestion";

export interface SceneWorldSuggestionRepository {
  listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneWorldSuggestion[]>;
  accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion | null>;
  dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion | null>;
}
