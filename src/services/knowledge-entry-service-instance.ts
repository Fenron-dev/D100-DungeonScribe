import { prisma } from "@/db/prisma";
import { PrismaKnowledgeEntryRepository } from "@/repositories/prisma/prisma-knowledge-entry-repository";
import { KnowledgeEntryService } from "@/services/knowledge-entry-service";

export const knowledgeEntryService = new KnowledgeEntryService(
  new PrismaKnowledgeEntryRepository(prisma),
);
