import { prisma } from "@/db/prisma";
import { PrismaSceneStateSuggestionRepository } from "@/repositories/prisma/prisma-scene-state-suggestion-repository";
import { SceneStateSuggestionService } from "@/services/scene-state-suggestion-service";

export const sceneStateSuggestionService = new SceneStateSuggestionService(
  new PrismaSceneStateSuggestionRepository(prisma),
);
