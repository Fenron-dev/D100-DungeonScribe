import { prisma } from "@/db/prisma";
import { PrismaSceneWorldSuggestionRepository } from "@/repositories/prisma/prisma-scene-world-suggestion-repository";
import { SceneWorldSuggestionService } from "@/services/scene-world-suggestion-service";

export const sceneWorldSuggestionService = new SceneWorldSuggestionService(
  new PrismaSceneWorldSuggestionRepository(prisma),
);
