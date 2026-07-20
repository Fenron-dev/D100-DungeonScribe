import { describe, expect, it } from "vitest";
import type { SceneStateSuggestion } from "@/domain/scene-state-suggestion";
import type { SceneStateSuggestionRepository } from "@/repositories/scene-state-suggestion-repository";
import type { SceneStateSuggestionResolution } from "@/schemas/scene-state-suggestion";
import {
  SceneStateSuggestionNotFoundError,
  SceneStateSuggestionService,
} from "@/services/scene-state-suggestion-service";

const pendingSuggestion: SceneStateSuggestion = {
  id: "suggestion-1",
  campaignId: "campaign-1",
  sceneId: "scene-1",
  messageId: "message-1",
  kind: "knowledge",
  title: "Der verborgene Durchgang",
  content: "Hinter der Wand ist ein sichtbarer Durchgang.",
  status: "pending",
  createdRecordId: null,
  createdAt: new Date("2026-07-20T10:00:00.000Z"),
  resolvedAt: null,
};

class MemoryStateSuggestionRepository implements SceneStateSuggestionRepository {
  public suggestion: SceneStateSuggestion | null = pendingSuggestion;

  public async listPending(): Promise<SceneStateSuggestion[]> {
    return this.suggestion?.status === "pending" ? [this.suggestion] : [];
  }

  public async accept(
    _campaignId: string,
    _sceneId: string,
    _suggestionId: string,
    resolution: SceneStateSuggestionResolution,
  ): Promise<SceneStateSuggestion | null> {
    if (
      !this.suggestion ||
      this.suggestion.status !== "pending" ||
      this.suggestion.kind !== resolution.kind
    ) return null;
    this.suggestion = {
      ...this.suggestion,
      title: resolution.draft.title,
      content: resolution.kind === "knowledge"
        ? resolution.draft.content
        : resolution.draft.premise,
      status: "accepted",
      createdRecordId: "record-1",
      resolvedAt: new Date("2026-07-20T10:01:00.000Z"),
    };
    return this.suggestion;
  }

  public async dismiss(): Promise<SceneStateSuggestion | null> {
    if (!this.suggestion || this.suggestion.status !== "pending") return null;
    this.suggestion = {
      ...this.suggestion,
      status: "dismissed",
      resolvedAt: new Date("2026-07-20T10:01:00.000Z"),
    };
    return this.suggestion;
  }
}

describe("SceneStateSuggestionService", () => {
  it("requires an explicit knowledge type and truth status before acceptance", async () => {
    const service = new SceneStateSuggestionService(
      new MemoryStateSuggestionRepository(),
    );
    await expect(
      service.accept("campaign-1", "scene-1", "suggestion-1", {
        kind: "knowledge",
        draft: {
          title: "Geprüfter Durchgang",
          content: "Hinter der Wand ist ein sichtbarer Durchgang.",
          type: "fact",
          truthStatus: "true",
          knownByCharacterIds: [],
          relatedEntityIds: [],
          locked: true,
        },
      }),
    ).resolves.toMatchObject({
      status: "accepted",
      createdRecordId: "record-1",
      title: "Geprüfter Durchgang",
    });
  });

  it("rejects a second resolution of the same proposal", async () => {
    const repository = new MemoryStateSuggestionRepository();
    const service = new SceneStateSuggestionService(repository);
    await service.dismiss("campaign-1", "scene-1", "suggestion-1");
    await expect(
      service.dismiss("campaign-1", "scene-1", "suggestion-1"),
    ).rejects.toBeInstanceOf(SceneStateSuggestionNotFoundError);
  });
});
