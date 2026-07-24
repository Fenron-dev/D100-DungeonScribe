import type { LibraryWorldEntity } from "@/domain/library-world-entity";
import type { WorldEntityDraft } from "@/domain/world-entity";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { LibraryWorldEntityRepository } from "@/repositories/library-world-entity-repository";
import { worldEntityDraftSchema } from "@/schemas/world-entity";

type LibraryRow = Awaited<
  ReturnType<PrismaClient["libraryWorldEntity"]["findUnique"]>
>;

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function mapLibraryWorldEntity(
  row: NonNullable<LibraryRow>,
): LibraryWorldEntity {
  return {
    id: row.id,
    sourceEntityId: row.sourceEntityId,
    draft: worldEntityDraftSchema.parse(row.draft),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaLibraryWorldEntityRepository
  implements LibraryWorldEntityRepository
{
  public constructor(private readonly client: PrismaClient) {}

  public async save(
    sourceEntityId: string,
    draft: WorldEntityDraft,
  ): Promise<LibraryWorldEntity> {
    const row = await this.client.libraryWorldEntity.upsert({
      where: { sourceEntityId },
      create: { sourceEntityId, draft: toPrismaJson(draft) },
      update: { draft: toPrismaJson(draft) },
    });
    return mapLibraryWorldEntity(row);
  }

  public async findById(id: string): Promise<LibraryWorldEntity | null> {
    const row = await this.client.libraryWorldEntity.findUnique({
      where: { id },
    });
    return row ? mapLibraryWorldEntity(row) : null;
  }

  public async list(): Promise<LibraryWorldEntity[]> {
    const rows = await this.client.libraryWorldEntity.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
    return rows.map(mapLibraryWorldEntity);
  }

  public async listSourceEntityIds(
    sourceEntityIds: string[],
  ): Promise<string[]> {
    if (sourceEntityIds.length === 0) return [];
    const rows = await this.client.libraryWorldEntity.findMany({
      where: { sourceEntityId: { in: sourceEntityIds } },
      select: { sourceEntityId: true },
    });
    return rows.map(({ sourceEntityId }) => sourceEntityId);
  }

  public async removeBySourceEntityId(
    sourceEntityId: string,
  ): Promise<boolean> {
    const result = await this.client.libraryWorldEntity.deleteMany({
      where: { sourceEntityId },
    });
    return result.count > 0;
  }
}
