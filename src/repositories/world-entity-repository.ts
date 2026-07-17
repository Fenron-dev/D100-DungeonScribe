import type {
  WorldEntity,
  WorldEntityDraft,
  WorldEntityRelation,
  WorldEntityRelationDraft,
} from "@/domain/world-entity";

export interface WorldEntityRepository {
  create(campaignId: string, draft: WorldEntityDraft): Promise<WorldEntity | null>;
  findById(campaignId: string, entityId: string): Promise<WorldEntity | null>;
  listByCampaign(campaignId: string): Promise<WorldEntity[]>;
  update(
    campaignId: string,
    entityId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity | null>;
  createRelation(
    campaignId: string,
    sourceEntityId: string,
    draft: WorldEntityRelationDraft,
  ): Promise<WorldEntityRelation | null>;
  listRelations(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntityRelation[]>;
  removeRelation(
    campaignId: string,
    entityId: string,
    relationId: string,
  ): Promise<boolean>;
}
