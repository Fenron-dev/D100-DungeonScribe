import type {
  KnowledgeEntry,
  KnowledgeEntryDraft,
} from "@/domain/knowledge-entry";

export interface KnowledgeEntryRepository {
  create(
    campaignId: string,
    draft: KnowledgeEntryDraft,
  ): Promise<KnowledgeEntry | null>;
  findById(
    campaignId: string,
    entryId: string,
  ): Promise<KnowledgeEntry | null>;
  listByCampaign(campaignId: string): Promise<KnowledgeEntry[]>;
  update(
    campaignId: string,
    entryId: string,
    draft: KnowledgeEntryDraft,
  ): Promise<KnowledgeEntry | null>;
}
