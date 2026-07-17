import type {
  WorldEntity,
  WorldEntityDraft,
  WorldEntityRelation,
  WorldEntityRelationDraft,
} from "@/domain/world-entity";
import { z } from "zod";
import type { PrismaClient } from "@/generated/prisma/client";
import type { WorldEntityRepository } from "@/repositories/world-entity-repository";
import {
  worldEntityDraftSchema,
  worldEntityRelationDraftSchema,
} from "@/schemas/world-entity";

type WorldEntityRow = Awaited<
  ReturnType<PrismaClient["worldEntity"]["findUnique"]>
>;

function mapWorldEntity(row: NonNullable<WorldEntityRow>): WorldEntity {
  const persistedDetails = z
    .record(z.string(), z.unknown())
    .catch({})
    .parse(row.details);
  const draft = worldEntityDraftSchema.parse({
    type: row.type,
    name: row.name,
    summary: row.summary,
    description: row.description,
    tags: row.tags,
    status: row.status,
    details: { type: row.type, ...persistedDetails },
  });

  return {
    id: row.id,
    campaignId: row.campaignId,
    ...draft,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

type WorldEntityRelationRow = Awaited<
  ReturnType<PrismaClient["worldEntityRelation"]["findUnique"]>
>;

function mapRelation(
  row: NonNullable<WorldEntityRelationRow>,
): WorldEntityRelation {
  const draft = worldEntityRelationDraftSchema.parse({
    targetEntityId: row.targetEntityId,
    type: row.type,
    description: row.description,
    status: row.status,
  });
  return {
    id: row.id,
    campaignId: row.campaignId,
    sourceEntityId: row.sourceEntityId,
    ...draft,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaWorldEntityRepository implements WorldEntityRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async create(
    campaignId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity | null> {
    const campaign = await this.client.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true },
    });
    if (!campaign) {
      return null;
    }

    return this.client.$transaction(async (transaction) => {
      const entity = await transaction.worldEntity.create({
        data: { campaignId, ...draft },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ENTITY_CREATED",
          summary: "Weltobjekt erstellt",
          payload: { entityId: entity.id, type: entity.type, name: entity.name },
          source: "player",
          reversible: false,
        },
      });
      return mapWorldEntity(entity);
    });
  }

  public async findById(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntity | null> {
    const entity = await this.client.worldEntity.findFirst({
      where: { id: entityId, campaignId },
    });
    return entity ? mapWorldEntity(entity) : null;
  }

  public async listByCampaign(campaignId: string): Promise<WorldEntity[]> {
    const entities = await this.client.worldEntity.findMany({
      where: { campaignId },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    });
    return entities.map(mapWorldEntity);
  }

  public async update(
    campaignId: string,
    entityId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity | null> {
    const existing = await this.client.worldEntity.findFirst({
      where: { id: entityId, campaignId },
    });
    if (!existing) {
      return null;
    }

    return this.client.$transaction(async (transaction) => {
      const entity = await transaction.worldEntity.update({
        where: { id: entityId },
        data: draft,
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ENTITY_UPDATED",
          summary: "Weltobjekt bearbeitet",
          payload: {
            entityId: entity.id,
            type: entity.type,
            previousName: existing.name,
            name: entity.name,
          },
          source: "player",
          reversible: true,
        },
      });
      return mapWorldEntity(entity);
    });
  }

  public async createRelation(
    campaignId: string,
    sourceEntityId: string,
    draft: WorldEntityRelationDraft,
  ): Promise<WorldEntityRelation | null> {
    const entities = await this.client.worldEntity.findMany({
      where: { campaignId, id: { in: [sourceEntityId, draft.targetEntityId] } },
      select: { id: true, name: true },
    });
    if (entities.length !== 2) {
      return null;
    }
    const names = new Map(entities.map((entity) => [entity.id, entity.name]));
    return this.client.$transaction(async (transaction) => {
      const relation = await transaction.worldEntityRelation.create({
        data: { campaignId, sourceEntityId, ...draft },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ENTITY_RELATION_CREATED",
          summary: "Weltobjekte verknüpft",
          payload: {
            relationId: relation.id,
            sourceEntityId,
            sourceName: names.get(sourceEntityId),
            targetEntityId: draft.targetEntityId,
            targetName: names.get(draft.targetEntityId),
            type: draft.type,
          },
          source: "player",
          reversible: true,
        },
      });
      return mapRelation(relation);
    });
  }

  public async listRelations(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntityRelation[]> {
    const relations = await this.client.worldEntityRelation.findMany({
      where: {
        campaignId,
        OR: [{ sourceEntityId: entityId }, { targetEntityId: entityId }],
      },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    });
    return relations.map(mapRelation);
  }

  public async removeRelation(
    campaignId: string,
    entityId: string,
    relationId: string,
  ): Promise<boolean> {
    const relation = await this.client.worldEntityRelation.findFirst({
      where: {
        id: relationId,
        campaignId,
        OR: [{ sourceEntityId: entityId }, { targetEntityId: entityId }],
      },
    });
    if (!relation) {
      return false;
    }
    await this.client.$transaction(async (transaction) => {
      await transaction.worldEntityRelation.delete({ where: { id: relation.id } });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ENTITY_RELATION_REMOVED",
          summary: "Verknüpfung entfernt",
          payload: {
            relationId: relation.id,
            sourceEntityId: relation.sourceEntityId,
            targetEntityId: relation.targetEntityId,
            type: relation.type,
          },
          source: "player",
          reversible: true,
        },
      });
    });
    return true;
  }
}
