import type { Campaign, CampaignDraft } from "@/domain/campaign";
import type { PrismaClient } from "@/generated/prisma/client";
import type {
  CampaignListOptions,
  CampaignRepository,
} from "@/repositories/campaign-repository";
import { campaignStatusSchema, campaignTensionSchema } from "@/schemas/campaign";

type CampaignRow = Awaited<
  ReturnType<PrismaClient["campaign"]["findUnique"]>
>;

function mapCampaign(row: NonNullable<CampaignRow>): Campaign {
  return {
    id: row.id,
    name: row.name,
    premise: row.premise,
    genre: row.genre,
    mood: row.mood,
    tension: campaignTensionSchema.parse(row.tension),
    status: campaignStatusSchema.parse(row.status),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    archivedAt: row.archivedAt,
  };
}

export class PrismaCampaignRepository implements CampaignRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async create(draft: CampaignDraft): Promise<Campaign> {
    return this.client.$transaction(async (transaction) => {
      const campaign = await transaction.campaign.create({ data: draft });

      await transaction.campaignEvent.create({
        data: {
          campaignId: campaign.id,
          eventType: "CAMPAIGN_CREATED",
          summary: "Kampagne erstellt",
          payload: { name: campaign.name },
          source: "player",
          reversible: false,
        },
      });

      return mapCampaign(campaign);
    });
  }

  public async findById(id: string): Promise<Campaign | null> {
    const campaign = await this.client.campaign.findUnique({ where: { id } });
    return campaign ? mapCampaign(campaign) : null;
  }

  public async list(options: CampaignListOptions): Promise<Campaign[]> {
    const campaigns = await this.client.campaign.findMany({
      ...(options.includeArchived ? {} : { where: { status: "active" } }),
      orderBy: { updatedAt: "desc" },
    });

    return campaigns.map(mapCampaign);
  }

  public async update(
    id: string,
    draft: CampaignDraft,
  ): Promise<Campaign | null> {
    const existing = await this.client.campaign.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    return this.client.$transaction(async (transaction) => {
      const campaign = await transaction.campaign.update({
        where: { id },
        data: draft,
      });

      await transaction.campaignEvent.create({
        data: {
          campaignId: campaign.id,
          eventType: "CAMPAIGN_UPDATED",
          summary: "Kampagne bearbeitet",
          payload: { previousName: existing.name, name: campaign.name },
          source: "player",
          reversible: true,
        },
      });

      return mapCampaign(campaign);
    });
  }

  public async archive(id: string, archivedAt: Date): Promise<Campaign | null> {
    const existing = await this.client.campaign.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    if (existing.status === "archived") {
      return mapCampaign(existing);
    }

    return this.client.$transaction(async (transaction) => {
      const campaign = await transaction.campaign.update({
        where: { id },
        data: { status: "archived", archivedAt },
      });

      await transaction.campaignEvent.create({
        data: {
          campaignId: campaign.id,
          eventType: "CAMPAIGN_ARCHIVED",
          summary: "Kampagne archiviert",
          payload: { archivedAt: archivedAt.toISOString() },
          source: "player",
          reversible: true,
        },
      });

      return mapCampaign(campaign);
    });
  }
}
