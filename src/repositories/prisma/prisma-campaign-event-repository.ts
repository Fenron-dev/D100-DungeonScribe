import type { CampaignEvent } from "@/domain/campaign-event";
import type { PrismaClient } from "@/generated/prisma/client";
import type { CampaignEventRepository } from "@/repositories/campaign-event-repository";
import {
  campaignEventSourceSchema,
  campaignEventTypeSchema,
} from "@/schemas/campaign-event";

type CampaignEventRow = Awaited<
  ReturnType<PrismaClient["campaignEvent"]["findUnique"]>
>;

function mapCampaignEvent(row: NonNullable<CampaignEventRow>): CampaignEvent {
  return {
    id: row.id,
    campaignId: row.campaignId,
    eventType: campaignEventTypeSchema.parse(row.eventType),
    timestampReal: row.timestampReal,
    summary: row.summary,
    source: campaignEventSourceSchema.parse(row.source),
    reversible: row.reversible,
  };
}

export class PrismaCampaignEventRepository implements CampaignEventRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async listByCampaign(campaignId: string): Promise<CampaignEvent[]> {
    const events = await this.client.campaignEvent.findMany({
      where: { campaignId },
      orderBy: [{ timestampReal: "desc" }, { id: "desc" }],
    });
    return events.map(mapCampaignEvent);
  }
}
