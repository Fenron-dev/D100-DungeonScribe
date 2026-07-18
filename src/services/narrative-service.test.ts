import { describe, expect, it } from "vitest";
import type {
  NarrativeProvider,
  NarrationRequest,
  NarrationResult,
} from "@/ai/narrative-provider";
import type { SceneMessage } from "@/domain/scene-journal";
import type { NarrativeRepository } from "@/repositories/narrative-repository";
import { NarrativeService } from "@/services/narrative-service";

class MemoryNarrativeRepository implements NarrativeRepository {
  public saved: NarrationResult | null = null;

  public async loadContext(
    _campaignId: string,
    _sceneId: string,
    direction: string,
    locale: "de" | "en",
  ): Promise<NarrationRequest> {
    return {
      locale,
      direction,
      context: {
        campaign: { name: "Test", premise: "Nebel", genre: null, mood: null, tension: 3 },
        scene: {
          title: "Turm",
          actualSetup: "Still",
          objective: null,
          participants: [],
          activeThreads: [],
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
      createdAt: new Date("2026-07-18T10:00:00.000Z"),
    };
  }
}

describe("NarrativeService", () => {
  it("stores only a validated provider result", async () => {
    const repository = new MemoryNarrativeRepository();
    const provider: NarrativeProvider = {
      generateNarration: async () => ({ narration: "Der Nebel bewegt sich." }),
    };
    const service = new NarrativeService(repository, provider);
    const message = await service.narrate("campaign-1", "scene-1", "Eine Spur", "de");
    expect(message?.source).toBe("ai");
    expect(repository.saved).toEqual({ narration: "Der Nebel bewegt sich." });
  });
});
