import type { CampaignEvent } from "@/domain/campaign-event";

export interface CampaignEventRepository {
  listByCampaign(campaignId: string): Promise<CampaignEvent[]>;
}
