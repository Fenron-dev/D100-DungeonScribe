import { prisma } from "@/db/prisma";
import { PrismaCampaignEventRepository } from "@/repositories/prisma/prisma-campaign-event-repository";
import { CampaignEventService } from "@/services/campaign-event-service";

export const campaignEventService = new CampaignEventService(
  new PrismaCampaignEventRepository(prisma),
);
