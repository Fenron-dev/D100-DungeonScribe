import { describe, expect, it } from "vitest";
import type { Scene, SceneCompletion, SceneDraft } from "@/domain/scene";
import type { SceneRepository } from "@/repositories/scene-repository";
import {
  ActiveSceneExistsError,
  SceneNotFoundError,
  SceneService,
} from "./scene-service";

class InMemorySceneRepository implements SceneRepository {
  private readonly scenes: Scene[] = [];
  public lastCompletion: SceneCompletion | null = null;

  public async create(campaignId: string, draft: SceneDraft) {
    if (campaignId === "missing") return null;
    const now = new Date("2026-07-17T17:00:00.000Z");
    const scene: Scene = {
      id: `scene-${this.scenes.length + 1}`,
      campaignId,
      ...draft,
      status: "active",
      summary: null,
      startedAtReal: now,
      endedAtReal: null,
      createdAt: now,
      updatedAt: now,
    };
    this.scenes.push(scene);
    return scene;
  }

  public async findById(campaignId: string, sceneId: string) {
    return this.scenes.find(
      (scene) => scene.campaignId === campaignId && scene.id === sceneId,
    ) ?? null;
  }

  public async findActive(campaignId: string) {
    return this.scenes.find(
      (scene) => scene.campaignId === campaignId && scene.status === "active",
    ) ?? null;
  }

  public async listByCampaign(campaignId: string) {
    return this.scenes.filter((scene) => scene.campaignId === campaignId);
  }

  public async findCampaignTension(campaignId: string) {
    return campaignId === "missing" ? null : 3;
  }

  public async complete(
    campaignId: string,
    sceneId: string,
    completion: SceneCompletion,
    endedAtReal: Date,
  ) {
    const scene = await this.findById(campaignId, sceneId);
    if (!scene || scene.status !== "active") return null;
    this.lastCompletion = completion;
    Object.assign(scene, { status: "completed", summary: completion.summary, endedAtReal });
    return scene;
  }
}

const draft = {
  title: " Die Straße im Nebel ",
  locationId: "entity-1",
  expectedSetup: " Mara erreicht die Nebelwacht. ",
  actualSetup: " Mara hört Schritte im leeren Turm. ",
  objective: "",
  participantCharacterIds: ["character-1"],
  participantEntityIds: ["entity-2"],
  relevantThreadIds: ["thread-1"],
};

describe("SceneService", () => {
  it("starts and completes a normalized scene", async () => {
    const endedAt = new Date("2026-07-17T18:00:00.000Z");
    const repository = new InMemorySceneRepository();
    const service = new SceneService(repository, () => endedAt);
    const scene = await service.create("campaign-1", draft);
    const completed = await service.complete(
      "campaign-1",
      scene.id,
      {
        summary: " Mara findet eine verborgene Karte. ",
        tensionAdjustment: "increase",
      },
    );

    expect(scene).toMatchObject({ title: "Die Straße im Nebel", objective: null });
    expect(completed).toMatchObject({
      status: "completed",
      summary: "Mara findet eine verborgene Karte.",
      endedAtReal: endedAt,
    });
    expect(repository.lastCompletion?.tension).toMatchObject({
      previous: 3,
      adjustment: "increase",
      next: 4,
    });
  });

  it("prevents a second active scene", async () => {
    const service = new SceneService(new InMemorySceneRepository());
    await service.create("campaign-1", draft);

    await expect(service.create("campaign-1", draft)).rejects.toBeInstanceOf(
      ActiveSceneExistsError,
    );
  });

  it("rejects missing references", async () => {
    const service = new SceneService(new InMemorySceneRepository());

    await expect(service.create("missing", draft)).rejects.toBeInstanceOf(
      SceneNotFoundError,
    );
  });
});
