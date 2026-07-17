import type {
  KnowledgeEntry,
  KnowledgeEntryDraft,
} from "@/domain/knowledge-entry";
import type { KnowledgeEntryRepository } from "@/repositories/knowledge-entry-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import {
  knowledgeEntryDraftSchema,
  knowledgeEntryIdSchema,
} from "@/schemas/knowledge-entry";

export class KnowledgeEntryNotFoundError extends Error {
  public constructor() {
    super("Knowledge entry, campaign, character, or world entity not found.");
    this.name = "KnowledgeEntryNotFoundError";
  }
}

export class KnowledgeEntryService {
  public constructor(private readonly repository: KnowledgeEntryRepository) {}

  public async create(campaignId: string, input: unknown): Promise<KnowledgeEntry> {
    const entry = await this.repository.create(
      campaignIdSchema.parse(campaignId),
      knowledgeEntryDraftSchema.parse(input),
    );
    if (!entry) throw new KnowledgeEntryNotFoundError();
    return entry;
  }

  public async findById(
    campaignId: string,
    entryId: string,
  ): Promise<KnowledgeEntry | null> {
    return this.repository.findById(
      campaignIdSchema.parse(campaignId),
      knowledgeEntryIdSchema.parse(entryId),
    );
  }

  public async list(campaignId: string): Promise<KnowledgeEntry[]> {
    return this.repository.listByCampaign(campaignIdSchema.parse(campaignId));
  }

  public async update(
    campaignId: string,
    entryId: string,
    input: unknown,
  ): Promise<KnowledgeEntry> {
    const draft: KnowledgeEntryDraft = knowledgeEntryDraftSchema.parse(input);
    const entry = await this.repository.update(
      campaignIdSchema.parse(campaignId),
      knowledgeEntryIdSchema.parse(entryId),
      draft,
    );
    if (!entry) throw new KnowledgeEntryNotFoundError();
    return entry;
  }
}
