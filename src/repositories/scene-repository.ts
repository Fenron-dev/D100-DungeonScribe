import type { Scene, SceneDraft } from "@/domain/scene";

export interface SceneRepository {
  create(campaignId: string, draft: SceneDraft): Promise<Scene | null>;
  findById(campaignId: string, sceneId: string): Promise<Scene | null>;
  findActive(campaignId: string): Promise<Scene | null>;
  listByCampaign(campaignId: string): Promise<Scene[]>;
  complete(
    campaignId: string,
    sceneId: string,
    summary: string,
    endedAtReal: Date,
  ): Promise<Scene | null>;
}
