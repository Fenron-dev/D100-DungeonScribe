import { prisma } from "@/db/prisma";
import { PrismaCharacterRepository } from "@/repositories/prisma/prisma-character-repository";
import { CharacterService } from "@/services/character-service";

export const characterService = new CharacterService(
  new PrismaCharacterRepository(prisma),
);
