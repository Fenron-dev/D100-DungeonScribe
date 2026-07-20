import type { SceneStateSuggestion } from "@/domain/scene-state-suggestion";
import type { SceneStateSuggestionResolution } from "@/schemas/scene-state-suggestion";

export interface SceneStateSuggestionRepository {
  listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneStateSuggestion[]>;
  accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
    resolution: SceneStateSuggestionResolution,
  ): Promise<SceneStateSuggestion | null>;
  dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneStateSuggestion | null>;
}
