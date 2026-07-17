import type { Scene } from "@/domain/scene";
import type { SceneRepository } from "@/repositories/scene-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { sceneDraftSchema, sceneIdSchema, sceneSummarySchema } from "@/schemas/scene";

export class SceneNotFoundError extends Error {
  public constructor() {
    super("Scene, campaign, or related campaign data not found.");
    this.name = "SceneNotFoundError";
  }
}

export class ActiveSceneExistsError extends Error {
  public constructor() {
    super("The campaign already has an active scene.");
    this.name = "ActiveSceneExistsError";
  }
}

export class SceneService {
  public constructor(
    private readonly repository: SceneRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  public async create(campaignId: string, input: unknown): Promise<Scene> {
    const validCampaignId = campaignIdSchema.parse(campaignId);
    if (await this.repository.findActive(validCampaignId)) {
      throw new ActiveSceneExistsError();
    }
    const scene = await this.repository.create(
      validCampaignId,
      sceneDraftSchema.parse(input),
    );
    if (!scene) throw new SceneNotFoundError();
    return scene;
  }

  public async findById(campaignId: string, sceneId: string) {
    return this.repository.findById(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
    );
  }

  public async findActive(campaignId: string) {
    return this.repository.findActive(campaignIdSchema.parse(campaignId));
  }

  public async list(campaignId: string) {
    return this.repository.listByCampaign(campaignIdSchema.parse(campaignId));
  }

  public async complete(
    campaignId: string,
    sceneId: string,
    summaryInput: unknown,
  ): Promise<Scene> {
    const scene = await this.repository.complete(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      sceneSummarySchema.parse(summaryInput),
      this.now(),
    );
    if (!scene) throw new SceneNotFoundError();
    return scene;
  }
}
