import type {
  CampaignEvent,
  CampaignEventCategory,
} from "@/domain/campaign-event";
import { getCampaignEventCategory } from "@/domain/campaign-event";
import type { CampaignEventRepository } from "@/repositories/campaign-event-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { campaignEventCategorySchema } from "@/schemas/campaign-event";

export class CampaignEventService {
  public constructor(private readonly repository: CampaignEventRepository) {}

  public async list(
    campaignId: string,
    categoryInput: unknown = "all",
  ): Promise<CampaignEvent[]> {
    const validCampaignId = campaignIdSchema.parse(campaignId);
    const category: CampaignEventCategory =
      campaignEventCategorySchema.parse(categoryInput);
    const events = await this.repository.listByCampaign(validCampaignId);
    return category === "all"
      ? events
      : events.filter(
          (event) => getCampaignEventCategory(event.eventType) === category,
        );
  }
}
