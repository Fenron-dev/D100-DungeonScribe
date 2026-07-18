import { z } from "zod";
import {
  narrationRequestSchema,
  type NarrationRequest,
  type NarrationResult,
} from "@/ai/narrative-provider";
import type { SceneMessage } from "@/domain/scene-journal";
import type { PrismaClient } from "@/generated/prisma/client";
import type { NarrativeRepository } from "@/repositories/narrative-repository";

const idsSchema = z.array(z.string());

export class PrismaNarrativeRepository implements NarrativeRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async loadContext(
    campaignId: string,
    sceneId: string,
    direction: string,
    locale: "de" | "en",
  ): Promise<NarrationRequest | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      include: { campaign: true },
    });
    if (!scene || scene.campaign.status !== "active") return null;
    const characterIds = idsSchema.parse(scene.participantCharacterIds);
    const entityIds = idsSchema.parse(scene.participantEntityIds);
    const threadIds = idsSchema.parse(scene.relevantThreadIds);
    const [characters, entities, threads] = await Promise.all([
      this.client.character.findMany({
        where: { campaignId, id: { in: characterIds } },
        select: { name: true },
      }),
      this.client.worldEntity.findMany({
        where: { campaignId, id: { in: entityIds } },
        select: { name: true },
      }),
      this.client.storyThread.findMany({
        where: { campaignId, id: { in: threadIds }, status: "open" },
        select: { title: true },
      }),
    ]);
    return narrationRequestSchema.parse({
      locale,
      direction,
      context: {
        campaign: {
          name: scene.campaign.name,
          premise: scene.campaign.premise,
          genre: scene.campaign.genre,
          mood: scene.campaign.mood,
          tension: scene.campaign.tension,
          futureIdeas: scene.campaign.futureIdeas,
          style: scene.campaign.style,
        },
        scene: {
          title: scene.title,
          actualSetup: scene.actualSetup,
          objective: scene.objective,
          participants: [
            ...characters.map(({ name }) => name),
            ...entities.map(({ name }) => name),
          ],
          activeThreads: threads.map(({ title }) => title),
        },
      },
    });
  }

  public async saveNarration(
    campaignId: string,
    sceneId: string,
    result: NarrationResult,
  ): Promise<SceneMessage | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      select: { id: true },
    });
    if (!scene) return null;
    return this.client.$transaction(async (transaction) => {
      const message = await transaction.sceneMessage.create({
        data: {
          campaignId,
          sceneId,
          role: "narrator",
          content: result.narration,
          source: "ai",
        },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "AI_NARRATION_GENERATED",
          summary: "KI-Erzählung erzeugt",
          payload: { sceneId, messageId: message.id },
          source: "ai",
          reversible: false,
        },
      });
      return { ...message, role: "narrator", source: "ai" };
    });
  }
}
