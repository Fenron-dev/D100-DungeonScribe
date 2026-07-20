import type { SceneWorldSuggestion } from "@/domain/scene-world-suggestion";
import type { SceneWorldSuggestionRepository } from "@/repositories/scene-world-suggestion-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { sceneIdSchema } from "@/schemas/scene";
import { sceneWorldSuggestionIdSchema } from "@/schemas/scene-world-suggestion";

export class SceneWorldSuggestionNotFoundError extends Error {
  public constructor() {
    super("Pending scene suggestion not found.");
    this.name = "SceneWorldSuggestionNotFoundError";
  }
}

export class SceneWorldSuggestionService {
  public constructor(
    private readonly repository: SceneWorldSuggestionRepository,
  ) {}

  public async listPending(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneWorldSuggestion[]> {
    return this.repository.listPending(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
    );
  }

  public async accept(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion> {
    const suggestion = await this.repository.accept(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      sceneWorldSuggestionIdSchema.parse(suggestionId),
    );
    if (!suggestion) throw new SceneWorldSuggestionNotFoundError();
    return suggestion;
  }

  public async dismiss(
    campaignId: string,
    sceneId: string,
    suggestionId: string,
  ): Promise<SceneWorldSuggestion> {
    const suggestion = await this.repository.dismiss(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      sceneWorldSuggestionIdSchema.parse(suggestionId),
    );
    if (!suggestion) throw new SceneWorldSuggestionNotFoundError();
    return suggestion;
  }
}
