import type { Campaign, CampaignDraft } from "@/domain/campaign";

export interface CampaignListOptions {
  includeArchived: boolean;
}

export interface CampaignRepository {
  create(draft: CampaignDraft): Promise<Campaign>;
  findById(id: string): Promise<Campaign | null>;
  list(options: CampaignListOptions): Promise<Campaign[]>;
  update(id: string, draft: CampaignDraft): Promise<Campaign | null>;
  archive(id: string, archivedAt: Date): Promise<Campaign | null>;
}
