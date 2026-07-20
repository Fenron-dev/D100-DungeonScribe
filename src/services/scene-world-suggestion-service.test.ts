import { describe, expect, it } from "vitest";
import type { SceneWorldSuggestion } from "@/domain/scene-world-suggestion";
import type { SceneWorldSuggestionRepository } from "@/repositories/scene-world-suggestion-repository";
import {
  SceneWorldSuggestionNotFoundError,
  SceneWorldSuggestionService,
} from "@/services/scene-world-suggestion-service";

const pendingSuggestion: SceneWorldSuggestion = {
  id: "suggestion-1",
  campaignId: "campaign-1",
  sceneId: "scene-1",
  messageId: "message-1",
  type: "location",
  name: "Verborgener Durchgang",
  summary: "Ein Weg mit noch unbekanntem Ziel.",
  status: "pending",
  createdEntityId: null,
  createdAt: new Date("2026-07-20T10:00:00.000Z"),
  resolvedAt: null,
};

class MemorySuggestionRepository implements SceneWorldSuggestionRepository {
  public suggestion: SceneWorldSuggestion | null = pendingSuggestion;

  public async listPending(): Promise<SceneWorldSuggestion[]> {
    return this.suggestion?.status === "pending" ? [this.suggestion] : [];
  }

  public async accept(): Promise<SceneWorldSuggestion | null> {
    if (!this.suggestion || this.suggestion.status !== "pending") return null;
    this.suggestion = {
      ...this.suggestion,
      status: "accepted",
      createdEntityId: "entity-1",
      resolvedAt: new Date("2026-07-20T10:01:00.000Z"),
    };
    return this.suggestion;
  }

  public async dismiss(): Promise<SceneWorldSuggestion | null> {
    if (!this.suggestion || this.suggestion.status !== "pending") return null;
    this.suggestion = {
      ...this.suggestion,
      status: "dismissed",
      resolvedAt: new Date("2026-07-20T10:01:00.000Z"),
    };
    return this.suggestion;
  }
}

describe("SceneWorldSuggestionService", () => {
  it("accepts a pending suggestion exactly once", async () => {
    const repository = new MemorySuggestionRepository();
    const service = new SceneWorldSuggestionService(repository);
    await expect(
      service.accept("campaign-1", "scene-1", "suggestion-1"),
    ).resolves.toMatchObject({ status: "accepted", createdEntityId: "entity-1" });
    await expect(
      service.accept("campaign-1", "scene-1", "suggestion-1"),
    ).rejects.toBeInstanceOf(SceneWorldSuggestionNotFoundError);
  });

  it("dismisses a suggestion without creating a world entity", async () => {
    const repository = new MemorySuggestionRepository();
    const service = new SceneWorldSuggestionService(repository);
    await expect(
      service.dismiss("campaign-1", "scene-1", "suggestion-1"),
    ).resolves.toMatchObject({ status: "dismissed", createdEntityId: null });
    await expect(service.listPending("campaign-1", "scene-1")).resolves.toEqual([]);
  });
});
