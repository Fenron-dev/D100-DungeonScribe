import { prisma } from "@/db/prisma";
import { PrismaCharacterInventoryRepository } from "@/repositories/prisma/prisma-character-inventory-repository";
import { CharacterInventoryService } from "@/services/character-inventory-service";

export const characterInventoryService = new CharacterInventoryService(
  new PrismaCharacterInventoryRepository(prisma),
);
