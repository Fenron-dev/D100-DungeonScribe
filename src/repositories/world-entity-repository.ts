import type { WorldEntity, WorldEntityDraft } from "@/domain/world-entity";

export interface WorldEntityRepository {
  create(campaignId: string, draft: WorldEntityDraft): Promise<WorldEntity | null>;
  findById(campaignId: string, entityId: string): Promise<WorldEntity | null>;
  listByCampaign(campaignId: string): Promise<WorldEntity[]>;
  update(
    campaignId: string,
    entityId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity | null>;
}
