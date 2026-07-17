import { z } from "zod";
import type {
  KnowledgeEntry,
  KnowledgeEntryDraft,
} from "@/domain/knowledge-entry";
import type { PrismaClient } from "@/generated/prisma/client";
import type { KnowledgeEntryRepository } from "@/repositories/knowledge-entry-repository";
import { knowledgeEntryDraftSchema } from "@/schemas/knowledge-entry";

type KnowledgeEntryRow = Awaited<
  ReturnType<PrismaClient["knowledgeEntry"]["findUnique"]>
>;

const persistedIdsSchema = z.array(z.string());

function mapKnowledgeEntry(row: NonNullable<KnowledgeEntryRow>): KnowledgeEntry {
  const draft = knowledgeEntryDraftSchema.parse({
    title: row.title,
    content: row.content,
    type: row.type,
    truthStatus: row.truthStatus,
    knownByCharacterIds: persistedIdsSchema.parse(row.knownByCharacterIds),
    relatedEntityIds: persistedIdsSchema.parse(row.relatedEntityIds),
    locked: row.locked,
  });
  return {
    id: row.id,
    campaignId: row.campaignId,
    ...draft,
    sourceEventId: row.sourceEventId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaKnowledgeEntryRepository implements KnowledgeEntryRepository {
  public constructor(private readonly client: PrismaClient) {}

  private async referencesExist(
    campaignId: string,
    draft: KnowledgeEntryDraft,
  ): Promise<boolean> {
    const [campaign, characterCount, entityCount] = await Promise.all([
      this.client.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true },
      }),
      this.client.character.count({
        where: { campaignId, id: { in: draft.knownByCharacterIds } },
      }),
      this.client.worldEntity.count({
        where: { campaignId, id: { in: draft.relatedEntityIds } },
      }),
    ]);
    return (
      campaign !== null &&
      characterCount === draft.knownByCharacterIds.length &&
      entityCount === draft.relatedEntityIds.length
    );
  }

  public async create(
    campaignId: string,
    draft: KnowledgeEntryDraft,
  ): Promise<KnowledgeEntry | null> {
    if (!(await this.referencesExist(campaignId, draft))) return null;

    return this.client.$transaction(async (transaction) => {
      const entry = await transaction.knowledgeEntry.create({
        data: { campaignId, ...draft },
      });
      const event = await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "KNOWLEDGE_DISCOVERED",
          summary: "Wissenseintrag erstellt",
          payload: {
            knowledgeEntryId: entry.id,
            title: entry.title,
            type: entry.type,
          },
          source: "manual",
          reversible: false,
        },
      });
      const linkedEntry = await transaction.knowledgeEntry.update({
        where: { id: entry.id },
        data: { sourceEventId: event.id },
      });
      return mapKnowledgeEntry(linkedEntry);
    });
  }

  public async findById(
    campaignId: string,
    entryId: string,
  ): Promise<KnowledgeEntry | null> {
    const entry = await this.client.knowledgeEntry.findFirst({
      where: { id: entryId, campaignId },
    });
    return entry ? mapKnowledgeEntry(entry) : null;
  }

  public async listByCampaign(campaignId: string): Promise<KnowledgeEntry[]> {
    const entries = await this.client.knowledgeEntry.findMany({
      where: { campaignId },
      orderBy: [{ locked: "desc" }, { updatedAt: "desc" }, { title: "asc" }],
    });
    return entries.map(mapKnowledgeEntry);
  }

  public async update(
    campaignId: string,
    entryId: string,
    draft: KnowledgeEntryDraft,
  ): Promise<KnowledgeEntry | null> {
    const existing = await this.client.knowledgeEntry.findFirst({
      where: { id: entryId, campaignId },
    });
    if (!existing || !(await this.referencesExist(campaignId, draft))) return null;

    return this.client.$transaction(async (transaction) => {
      const entry = await transaction.knowledgeEntry.update({
        where: { id: entryId },
        data: draft,
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "KNOWLEDGE_UPDATED",
          summary: "Wissenseintrag bearbeitet",
          payload: {
            knowledgeEntryId: entry.id,
            previousTitle: existing.title,
            title: entry.title,
            type: entry.type,
            locked: entry.locked,
          },
          source: "manual",
          reversible: true,
        },
      });
      return mapKnowledgeEntry(entry);
    });
  }
}
