import type { SceneStateSuggestion } from "@/domain/scene-state-suggestion";
import type { SceneStateSuggestionRepository } from "@/repositories/scene-state-suggestion-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { sceneIdSchema } from "@/schemas/scene";
import {
  sceneStateSuggestionIdSchema,
  sceneStateSuggestionResolutionSchema,
} from "@/schemas/scene-state-suggestion";

export class SceneStateSuggestionNotFoundError extends Error {
  public constructor() {
    super("Pending scene state suggestion not found.");
    this.name = "SceneStateSuggestionNotFoundError";
  }
}

export class SceneStateSuggestionService {
  public constructor(
    private readonly repository: SceneStateSuggestionRepository,
  ) {}

  public async listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneStateSuggestion[]> {
    return this.repository.listPending(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
    );
  }

  public async accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
    input: unknown,
  ): Promise<SceneStateSuggestion> {
    const suggestion = await this.repository.accept(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      sceneStateSuggestionIdSchema.parse(suggestionId),
      sceneStateSuggestionResolutionSchema.parse(input),
    );
    if (!suggestion) throw new SceneStateSuggestionNotFoundError();
    return suggestion;
  }

  public async dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneStateSuggestion> {
    const suggestion = await this.repository.dismiss(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      sceneStateSuggestionIdSchema.parse(suggestionId),
    );
    if (!suggestion) throw new SceneStateSuggestionNotFoundError();
    return suggestion;
  }
}
