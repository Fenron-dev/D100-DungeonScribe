import type {
  WorldEntity,
  WorldEntityFilter,
  WorldEntityRelation,
} from "@/domain/world-entity";
import type { WorldEntityRepository } from "@/repositories/world-entity-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import {
  worldEntityDraftSchema,
  worldEntityFilterSchema,
  worldEntityIdSchema,
  worldEntityRelationDraftSchema,
  worldEntityRelationIdSchema,
} from "@/schemas/world-entity";

export class WorldEntityNotFoundError extends Error {
  public constructor() {
    super("World entity or campaign not found.");
    this.name = "WorldEntityNotFoundError";
  }
}

export class InvalidWorldEntityRelationError extends Error {
  public constructor(message = "A world entity cannot relate to itself.") {
    super(message);
    this.name = "InvalidWorldEntityRelationError";
  }
}

function matchesFilter(entity: WorldEntity, filter: WorldEntityFilter): boolean {
  if (filter.type && entity.type !== filter.type) {
    return false;
  }
  const query = filter.query?.toLowerCase();
  if (!query) {
    return true;
  }
  return [entity.name, entity.summary, ...entity.tags].some((value) =>
    value.toLowerCase().includes(query),
  );
}

export class WorldEntityService {
  public constructor(private readonly repository: WorldEntityRepository) {}

  public async create(campaignId: string, input: unknown): Promise<WorldEntity> {
    const entity = await this.repository.create(
      campaignIdSchema.parse(campaignId),
      worldEntityDraftSchema.parse(input),
    );
    if (!entity) {
      throw new WorldEntityNotFoundError();
    }
    return entity;
  }

  public async findById(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntity | null> {
    return this.repository.findById(
      campaignIdSchema.parse(campaignId),
      worldEntityIdSchema.parse(entityId),
    );
  }

  public async list(
    campaignId: string,
    filterInput: unknown = {},
  ): Promise<WorldEntity[]> {
    const filter = worldEntityFilterSchema.parse(filterInput);
    const entities = await this.repository.listByCampaign(
      campaignIdSchema.parse(campaignId),
    );
    return entities.filter((entity) => matchesFilter(entity, filter));
  }

  public async update(
    campaignId: string,
    entityId: string,
    input: unknown,
  ): Promise<WorldEntity> {
    const entity = await this.repository.update(
      campaignIdSchema.parse(campaignId),
      worldEntityIdSchema.parse(entityId),
      worldEntityDraftSchema.parse(input),
    );
    if (!entity) {
      throw new WorldEntityNotFoundError();
    }
    return entity;
  }

  public async createRelation(
    campaignId: string,
    sourceEntityId: string,
    input: unknown,
  ): Promise<WorldEntityRelation> {
    const validCampaignId = campaignIdSchema.parse(campaignId);
    const validSourceId = worldEntityIdSchema.parse(sourceEntityId);
    const draft = worldEntityRelationDraftSchema.parse(input);
    if (validSourceId === draft.targetEntityId) {
      throw new InvalidWorldEntityRelationError();
    }
    const relation = await this.repository.createRelation(
      validCampaignId,
      validSourceId,
      draft,
    );
    if (!relation) {
      throw new WorldEntityNotFoundError();
    }
    return relation;
  }

  public async listRelations(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntityRelation[]> {
    return this.repository.listRelations(
      campaignIdSchema.parse(campaignId),
      worldEntityIdSchema.parse(entityId),
    );
  }

  public async removeRelation(
    campaignId: string,
    entityId: string,
    relationId: string,
  ): Promise<void> {
    const removed = await this.repository.removeRelation(
      campaignIdSchema.parse(campaignId),
      worldEntityIdSchema.parse(entityId),
      worldEntityRelationIdSchema.parse(relationId),
    );
    if (!removed) {
      throw new WorldEntityNotFoundError();
    }
  }
}
