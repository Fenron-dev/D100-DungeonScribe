import { prisma } from "@/db/prisma";
import { PrismaSceneRepository } from "@/repositories/prisma/prisma-scene-repository";
import { SceneService } from "@/services/scene-service";

export const sceneService = new SceneService(new PrismaSceneRepository(prisma));
