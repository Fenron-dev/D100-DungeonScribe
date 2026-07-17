import { prisma } from "@/db/prisma";
import { PrismaStoryThreadRepository } from "@/repositories/prisma/prisma-story-thread-repository";
import { StoryThreadService } from "@/services/story-thread-service";

export const storyThreadService = new StoryThreadService(
  new PrismaStoryThreadRepository(prisma),
);
