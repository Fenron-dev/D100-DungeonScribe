import type {
  SceneWorldSuggestion,
  SceneWorldSuggestionDraft,
} from "@/domain/scene-world-suggestion";

export interface SceneWorldSuggestionRepository {
  listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneWorldSuggestion[]>;
  accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
    draft: SceneWorldSuggestionDraft,
  ): Promise<SceneWorldSuggestion | null>;
  dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion | null>;
}
