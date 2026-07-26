import { prisma } from "@/db/prisma";
import { PrismaCampaignStylePresetRepository } from "@/repositories/prisma/prisma-campaign-style-preset-repository";
import { CampaignStylePresetService } from "@/services/campaign-style-preset-service";

export const campaignStylePresetService = new CampaignStylePresetService(
  new PrismaCampaignStylePresetRepository(prisma),
);
