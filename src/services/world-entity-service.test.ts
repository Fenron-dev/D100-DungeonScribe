import { describe, expect, it } from "vitest";
import type { WorldEntity, WorldEntityDraft } from "@/domain/world-entity";
import type { WorldEntityRepository } from "@/repositories/world-entity-repository";
import {
  WorldEntityNotFoundError,
  WorldEntityService,
} from "./world-entity-service";

class InMemoryWorldEntityRepository implements WorldEntityRepository {
  private readonly entities = new Map<string, WorldEntity>();
  private nextId = 1;

  public async create(
    campaignId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity | null> {
    if (campaignId === "missing") {
      return null;
    }
    const now = new Date("2026-07-17T09:00:00.000Z");
    const entity: WorldEntity = {
      id: `entity-${this.nextId++}`,
      campaignId,
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    this.entities.set(entity.id, entity);
    return entity;
  }

  public async findById(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntity | null> {
    const entity = this.entities.get(entityId);
    return entity?.campaignId === campaignId ? entity : null;
  }

  public async listByCampaign(campaignId: string): Promise<WorldEntity[]> {
    return [...this.entities.values()].filter(
      (entity) => entity.campaignId === campaignId,
    );
  }

  public async update(
    campaignId: string,
    entityId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity | null> {
    const existing = await this.findById(campaignId, entityId);
    if (!existing) {
      return null;
    }
    const entity = { ...existing, ...draft };
    this.entities.set(entityId, entity);
    return entity;
  }
}

const locationDraft = {
  type: "location",
  name: "Leuchtturm der Nebelwacht",
  summary: "Der letzte sichere Ort an der Nordküste.",
  description: "",
  tags: [" Küste ", "Zuflucht"],
  status: "active",
};

describe("WorldEntityService", () => {
  it("creates, updates, and filters world entities", async () => {
    const service = new WorldEntityService(new InMemoryWorldEntityRepository());
    const location = await service.create("campaign-1", locationDraft);
    await service.create("campaign-1", {
      ...locationDraft,
      type: "faction",
      name: "Bund der Lotsen",
      tags: ["Lotsen"],
    });
    await service.update("campaign-1", location.id, {
      ...locationDraft,
      name: "Nebelwacht",
    });

    await expect(
      service.list("campaign-1", { query: "küste", type: "location" }),
    ).resolves.toMatchObject([{ name: "Nebelwacht", description: null }]);
    await expect(
      service.list("campaign-1", { type: "faction" }),
    ).resolves.toHaveLength(1);
  });

  it("rejects missing campaign and entity references", async () => {
    const service = new WorldEntityService(new InMemoryWorldEntityRepository());

    await expect(
      service.create("missing", locationDraft),
    ).rejects.toBeInstanceOf(WorldEntityNotFoundError);
    await expect(
      service.update("campaign-1", "missing", locationDraft),
    ).rejects.toBeInstanceOf(WorldEntityNotFoundError);
  });
});
