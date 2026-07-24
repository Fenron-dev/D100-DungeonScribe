import { describe, expect, it } from "vitest";
import type { Campaign } from "@/domain/campaign";
import type { LibraryWorldEntity } from "@/domain/library-world-entity";
import type {
  WorldEntity,
  WorldEntityDraft,
  WorldEntityRelation,
} from "@/domain/world-entity";
import type { CampaignRepository } from "@/repositories/campaign-repository";
import type { LibraryWorldEntityRepository } from "@/repositories/library-world-entity-repository";
import type { WorldEntityRepository } from "@/repositories/world-entity-repository";
import {
  LibrarySourceNotFoundError,
  LibraryTargetCampaignError,
  LibraryWorldEntityService,
} from "@/services/library-world-entity-service";
import { defaultCampaignStyle } from "@/domain/campaign-style";

const now = new Date("2026-07-24T12:00:00.000Z");

const activeCampaign: Campaign = {
  id: "campaign-active",
  name: "Die Straßen im Nebel",
  premise: "Eine verschwundene Straße ist zurückgekehrt.",
  genre: "Fantasy",
  mood: "Geheimnisvoll",
  templateId: "balanced",
  futureIdeas: null,
  style: defaultCampaignStyle,
  tension: 3,
  status: "active",
  createdAt: now,
  updatedAt: now,
  archivedAt: null,
};

const sourceEntity: WorldEntity = {
  id: "entity-source",
  campaignId: activeCampaign.id,
  type: "item",
  name: "Messingkompass",
  summary: "Zeigt auf verborgene Wege.",
  description: null,
  tags: ["Werkzeug"],
  status: "active",
  details: {
    type: "item",
    purpose: "Findet verborgene Wege",
    rarity: "Selten",
  },
  createdAt: now,
  updatedAt: now,
};

class MemoryLibraryRepository implements LibraryWorldEntityRepository {
  public entry: LibraryWorldEntity | null = null;

  public async save(
    sourceEntityId: string,
    draft: WorldEntityDraft,
  ): Promise<LibraryWorldEntity> {
    this.entry = {
      id: "library-entry",
      sourceEntityId,
      draft,
      createdAt: now,
      updatedAt: now,
    };
    return this.entry;
  }

  public async findById(id: string): Promise<LibraryWorldEntity | null> {
    return this.entry?.id === id ? this.entry : null;
  }

  public async list(): Promise<LibraryWorldEntity[]> {
    return this.entry ? [this.entry] : [];
  }

  public async listSourceEntityIds(
    sourceEntityIds: string[],
  ): Promise<string[]> {
    if (!this.entry || !sourceEntityIds.includes(this.entry.sourceEntityId)) {
      return [];
    }
    return [this.entry.sourceEntityId];
  }

  public async removeBySourceEntityId(
    sourceEntityId: string,
  ): Promise<boolean> {
    if (this.entry?.sourceEntityId !== sourceEntityId) return false;
    this.entry = null;
    return true;
  }
}

class MemoryWorldEntityRepository implements WorldEntityRepository {
  public source: WorldEntity | null = sourceEntity;
  public created: WorldEntity | null = null;

  public async create(
    campaignId: string,
    draft: WorldEntityDraft,
  ): Promise<WorldEntity> {
    this.created = {
      id: "entity-copy",
      campaignId,
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    return this.created;
  }

  public async findById(
    campaignId: string,
    entityId: string,
  ): Promise<WorldEntity | null> {
    if (
      this.source?.campaignId !== campaignId ||
      this.source.id !== entityId
    ) {
      return null;
    }
    return this.source;
  }

  public async listByCampaign(): Promise<WorldEntity[]> {
    return this.source ? [this.source] : [];
  }

  public async update(): Promise<WorldEntity | null> {
    return null;
  }

  public async createRelation(): Promise<WorldEntityRelation | null> {
    return null;
  }

  public async listRelations(): Promise<WorldEntityRelation[]> {
    return [];
  }

  public async removeRelation(): Promise<boolean> {
    return false;
  }
}

class MemoryCampaignRepository implements CampaignRepository {
  public campaign: Campaign | null = activeCampaign;

  public async create(): Promise<Campaign> {
    return activeCampaign;
  }

  public async findById(id: string): Promise<Campaign | null> {
    return this.campaign?.id === id ? this.campaign : null;
  }

  public async list(): Promise<Campaign[]> {
    return this.campaign ? [this.campaign] : [];
  }

  public async update(): Promise<Campaign | null> {
    return null;
  }

  public async archive(): Promise<Campaign | null> {
    return null;
  }
}

function createService(): {
  service: LibraryWorldEntityService;
  library: MemoryLibraryRepository;
  worlds: MemoryWorldEntityRepository;
  campaigns: MemoryCampaignRepository;
} {
  const library = new MemoryLibraryRepository();
  const worlds = new MemoryWorldEntityRepository();
  const campaigns = new MemoryCampaignRepository();
  return {
    service: new LibraryWorldEntityService(library, worlds, campaigns),
    library,
    worlds,
    campaigns,
  };
}

describe("LibraryWorldEntityService", () => {
  it("stores an independent world entity snapshot", async () => {
    const { service, library, worlds } = createService();

    await expect(
      service.saveFromCampaign(activeCampaign.id, sourceEntity.id),
    ).resolves.toMatchObject({
      sourceEntityId: sourceEntity.id,
      draft: {
        name: "Messingkompass",
        details: { type: "item", rarity: "Selten" },
      },
    });
    worlds.source = null;

    await expect(service.list()).resolves.toEqual([library.entry]);
    await expect(
      service.listSavedSourceIds([sourceEntity.id, "entity-other"]),
    ).resolves.toEqual([sourceEntity.id]);
  });

  it("copies a saved snapshot into an active campaign", async () => {
    const { service, worlds } = createService();
    await service.saveFromCampaign(activeCampaign.id, sourceEntity.id);

    await service.copyToCampaign("library-entry", activeCampaign.id);

    expect(worlds.created).toMatchObject({
      id: "entity-copy",
      campaignId: activeCampaign.id,
      name: "Messingkompass",
    });
  });

  it("rejects missing sources and archived target campaigns", async () => {
    const { service, worlds, campaigns } = createService();
    worlds.source = null;
    await expect(
      service.saveFromCampaign(activeCampaign.id, sourceEntity.id),
    ).rejects.toBeInstanceOf(LibrarySourceNotFoundError);

    worlds.source = sourceEntity;
    await service.saveFromCampaign(activeCampaign.id, sourceEntity.id);
    campaigns.campaign = {
      ...activeCampaign,
      status: "archived",
      archivedAt: now,
    };
    await expect(
      service.copyToCampaign("library-entry", activeCampaign.id),
    ).rejects.toBeInstanceOf(LibraryTargetCampaignError);
  });
});
