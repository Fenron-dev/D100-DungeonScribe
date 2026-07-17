import { prisma } from "@/db/prisma";
import { PrismaWorldEntityRepository } from "@/repositories/prisma/prisma-world-entity-repository";
import { WorldEntityService } from "@/services/world-entity-service";

export const worldEntityService = new WorldEntityService(
  new PrismaWorldEntityRepository(prisma),
);
