import type { Scene, SceneCompletion, SceneDraft } from "@/domain/scene";

export interface SceneRepository {
  create(campaignId: string, draft: SceneDraft): Promise<Scene | null>;
  findById(campaignId: string, sceneId: string): Promise<Scene | null>;
  findActive(campaignId: string): Promise<Scene | null>;
  listByCampaign(campaignId: string): Promise<Scene[]>;
  findCampaignTension(campaignId: string): Promise<number | null>;
  complete(
    campaignId: string,
    sceneId: string,
    completion: SceneCompletion,
    endedAtReal: Date,
  ): Promise<Scene | null>;
}
