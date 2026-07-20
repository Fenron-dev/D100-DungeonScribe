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

function selectRecentMessages(
  messagesDescending: Array<{ role: string; content: string }>,
): Array<{ role: string; content: string }> {
  const selected: Array<{ role: string; content: string }> = [];
  let characterCount = 0;
  for (const message of messagesDescending) {
    if (selected.length > 0 && characterCount + message.content.length > 24_000) break;
    selected.push(message);
    characterCount += message.content.length;
  }
  return selected.reverse();
}

export class PrismaNarrativeRepository implements NarrativeRepository {
  public constructor(private readonly client: PrismaClient) {}

  private async eligibleWorldSuggestions(
    campaignId: string,
    suggestions: NarrationResult["worldSuggestions"],
    excludedMessageId?: string,
  ): Promise<NarrationResult["worldSuggestions"]> {
    const [entities, pendingSuggestions] = await Promise.all([
      this.client.worldEntity.findMany({
        where: { campaignId },
        select: { name: true },
      }),
      this.client.sceneWorldSuggestion.findMany({
        where: {
          campaignId,
          status: "pending",
          ...(excludedMessageId ? { messageId: { not: excludedMessageId } } : {}),
        },
        select: { name: true },
      }),
    ]);
    const knownNames = new Set(
      [...entities, ...pendingSuggestions].map(({ name }) => name.trim().toLocaleLowerCase()),
    );
    return suggestions.filter(({ name }) => {
      const normalized = name.trim().toLocaleLowerCase();
      if (knownNames.has(normalized)) return false;
      knownNames.add(normalized);
      return true;
    });
  }

  public async loadContext(
    campaignId: string,
    sceneId: string,
    direction: string,
    locale: "de" | "en",
    excludedMessageId?: string,
  ): Promise<NarrationRequest | null> {
    if (excludedMessageId) {
      const replaceable = await this.client.sceneMessage.findFirst({
        where: {
          id: excludedMessageId,
          campaignId,
          sceneId,
          role: "narrator",
          source: "ai",
        },
        select: { id: true },
      });
      if (!replaceable) return null;
    }
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      include: { campaign: true },
    });
    if (!scene || scene.campaign.status !== "active") return null;
    const characterIds = idsSchema.parse(scene.participantCharacterIds);
    const entityIds = idsSchema.parse(scene.participantEntityIds);
    const threadIds = idsSchema.parse(scene.relevantThreadIds);
    const [characters, entities, threads, recentMessagesDescending] = await Promise.all([
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
      this.client.sceneMessage.findMany({
        where: {
          campaignId,
          sceneId,
          ...(excludedMessageId ? { id: { not: excludedMessageId } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 16,
        select: { role: true, content: true },
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
          recentMessages: selectRecentMessages(recentMessagesDescending).map(({ role, content }) => ({
            role,
            content,
          })),
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
    const worldSuggestions = await this.eligibleWorldSuggestions(
      campaignId,
      result.worldSuggestions,
    );
    return this.client.$transaction(async (transaction) => {
      const message = await transaction.sceneMessage.create({
        data: {
          campaignId,
          sceneId,
          role: "narrator",
          content: result.narration,
          source: "ai",
          revisions: { create: { content: result.narration } },
        },
        include: { revisions: true },
      });
      if (worldSuggestions.length > 0) {
        await transaction.sceneWorldSuggestion.createMany({
          data: worldSuggestions.map((suggestion) => ({
            campaignId,
            sceneId,
            messageId: message.id,
            ...suggestion,
          })),
        });
      }
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
      return {
        ...message,
        role: "narrator",
        source: "ai",
        versions: message.revisions.map(({ id, content, createdAt }) => ({ id, content, createdAt })),
      };
    });
  }

  public async replaceNarration(
    campaignId: string,
    sceneId: string,
    messageId: string,
    result: NarrationResult,
  ): Promise<SceneMessage | null> {
    const existing = await this.client.sceneMessage.findFirst({
      where: { id: messageId, campaignId, sceneId, role: "narrator", source: "ai" },
    });
    if (!existing) return null;
    const worldSuggestions = await this.eligibleWorldSuggestions(
      campaignId,
      result.worldSuggestions,
      messageId,
    );
    return this.client.$transaction(async (transaction) => {
      const existingRevision = await transaction.sceneMessageRevision.findFirst({
        where: { messageId, content: existing.content },
      });
      if (!existingRevision) {
        await transaction.sceneMessageRevision.create({
          data: { messageId, content: existing.content },
        });
      }
      const revision = await transaction.sceneMessageRevision.create({
        data: { messageId, content: result.narration },
      });
      const message = await transaction.sceneMessage.update({
        where: { id: messageId },
        data: { content: result.narration },
        include: { revisions: true },
      });
      await transaction.sceneWorldSuggestion.deleteMany({
        where: { messageId, status: "pending" },
      });
      if (worldSuggestions.length > 0) {
        await transaction.sceneWorldSuggestion.createMany({
          data: worldSuggestions.map((suggestion) => ({
            campaignId,
            sceneId,
            messageId,
            ...suggestion,
          })),
        });
      }
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "AI_NARRATION_REGENERATED",
          summary: "KI-Erzählung neu erzeugt",
          payload: { sceneId, messageId, versionId: revision.id },
          source: "ai",
          reversible: false,
        },
      });
      return {
        ...message,
        role: "narrator",
        source: "ai",
        versions: message.revisions.map(({ id, content, createdAt }) => ({ id, content, createdAt })),
      };
    });
  }
}
