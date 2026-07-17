import type { WorldEntity, WorldEntityDraft } from "@/domain/world-entity";
import type { PrismaClient } from "@/generated/prisma/client";
import type { WorldEntityRepository } from "@/repositories/world-entity-repository";
import {
  worldEntityDraftSchema,
  worldEntityTagsSchema,
} from "@/schemas/world-entity";

type WorldEntityRow = Awaited<
  ReturnType<PrismaClient["worldEntity"]["findUnique"]>
>;

function mapWorldEntity(row: NonNullable<WorldEntityRow>): WorldEntity {
  const draft = worldEntityDraftSchema.parse({
    type: row.type,
    name: row.name,
    summary: row.summary,
    description: row.description,
    tags: worldEntityTagsSchema.parse(row.tags),
    status: row.status,
  });

  return {
    id: row.id,
    campaignId: row.campaignId,
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
}
