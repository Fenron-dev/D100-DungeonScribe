import { prisma } from "@/db/prisma";
import { PrismaCampaignRepository } from "@/repositories/prisma/prisma-campaign-repository";
import { PrismaLibraryWorldEntityRepository } from "@/repositories/prisma/prisma-library-world-entity-repository";
import { PrismaWorldEntityRepository } from "@/repositories/prisma/prisma-world-entity-repository";
import { LibraryWorldEntityService } from "@/services/library-world-entity-service";

export const libraryWorldEntityService = new LibraryWorldEntityService(
  new PrismaLibraryWorldEntityRepository(prisma),
  new PrismaWorldEntityRepository(prisma),
  new PrismaCampaignRepository(prisma),
);
