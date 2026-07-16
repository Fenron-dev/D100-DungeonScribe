import { prisma } from "@/db/prisma";
import { PrismaCampaignRepository } from "@/repositories/prisma/prisma-campaign-repository";
import { CampaignService } from "@/services/campaign-service";

export const campaignService = new CampaignService(
  new PrismaCampaignRepository(prisma),
);
