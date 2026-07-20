import { describe, expect, it } from "vitest";
import type {
  NarrativeProvider,
  NarrationRequest,
  NarrationResult,
} from "@/ai/narrative-provider";
import type { SceneMessage } from "@/domain/scene-journal";
import type { NarrativeRepository } from "@/repositories/narrative-repository";
import { NarrativeService } from "@/services/narrative-service";
import { defaultCampaignStyle } from "@/domain/campaign-style";

class MemoryNarrativeRepository implements NarrativeRepository {
  public saved: NarrationResult | null = null;
  public excludedMessageId: string | undefined;

  public async loadContext(
    _campaignId: string,
    _sceneId: string,
    direction: string,
    locale: "de" | "en",
    excludedMessageId?: string,
  ): Promise<NarrationRequest> {
    this.excludedMessageId = excludedMessageId;
    return {
      locale,
      direction,
      context: {
        campaign: {
          name: "Test",
          premise: "Nebel",
          genre: null,
          mood: null,
          tension: 3,
          futureIdeas: null,
          style: defaultCampaignStyle,
        },
        scene: {
          title: "Turm",
          actualSetup: "Still",
          objective: null,
          participants: [],
          activeThreads: [],
          recentMessages: [],
        },
      },
    };
  }

  public async saveNarration(
    campaignId: string,
    sceneId: string,
    result: NarrationResult,
  ): Promise<SceneMessage> {
    this.saved = result;
    return {
      id: "message-1",
      campaignId,
      sceneId,
      role: "narrator",
      content: result.narration,
      source: "ai",
      versions: [],
      createdAt: new Date("2026-07-18T10:00:00.000Z"),
    };
  }
  public async replaceNarration(
    campaignId: string,
    sceneId: string,
    _messageId: string,
    result: NarrationResult,
  ): Promise<SceneMessage> {
    return this.saveNarration(campaignId, sceneId, result);
  }
}

describe("NarrativeService", () => {
  it("stores only a validated provider result", async () => {
    const repository = new MemoryNarrativeRepository();
    const provider: NarrativeProvider = {
      generateNarration: async () => ({
        narration: "Der Nebel bewegt sich.",
        worldSuggestions: [],
        stateSuggestions: [],
      }),
    };
    const service = new NarrativeService(repository, provider);
    const message = await service.narrate("campaign-1", "scene-1", "Eine Spur", "de");
    expect(message?.source).toBe("ai");
    expect(repository.saved).toEqual({
      narration: "Der Nebel bewegt sich.",
      worldSuggestions: [],
      stateSuggestions: [],
    });
  });

  it("regenerates a narration without feeding the replaced message back into context", async () => {
    const repository = new MemoryNarrativeRepository();
    const service = new NarrativeService(repository, {
      generateNarration: async () => ({
        narration: "Eine andere Tür erscheint.",
        worldSuggestions: [],
        stateSuggestions: [],
      }),
    });
    const message = await service.regenerate(
      "campaign-1",
      "scene-1",
      "message-1",
      "Deutlich anders",
    );
    expect(message?.content).toBe("Eine andere Tür erscheint.");
    expect(repository.excludedMessageId).toBe("message-1");
  });
});
