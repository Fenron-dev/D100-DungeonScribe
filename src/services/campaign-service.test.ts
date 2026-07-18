import { describe, expect, it } from "vitest";
import type { Campaign, CampaignDraft } from "@/domain/campaign";
import { defaultCampaignStyle } from "@/domain/campaign-style";
import type {
  CampaignListOptions,
  CampaignRepository,
} from "@/repositories/campaign-repository";
import {
  CampaignNotFoundError,
  CampaignService,
} from "./campaign-service";

class InMemoryCampaignRepository implements CampaignRepository {
  private readonly campaigns = new Map<string, Campaign>();
  private nextId = 1;

  public async create(draft: CampaignDraft): Promise<Campaign> {
    const now = new Date("2026-07-16T19:00:00.000Z");
    const campaign: Campaign = {
      id: `campaign-${this.nextId++}`,
      ...draft,
      tension: 3,
      status: "active",
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  public async findById(id: string): Promise<Campaign | null> {
    return this.campaigns.get(id) ?? null;
  }

  public async list(options: CampaignListOptions): Promise<Campaign[]> {
    return [...this.campaigns.values()].filter(
      ({ status }) => options.includeArchived || status === "active",
    );
  }

  public async update(
    id: string,
    draft: CampaignDraft,
  ): Promise<Campaign | null> {
    const existing = this.campaigns.get(id);
    if (!existing) {
      return null;
    }

    const campaign = { ...existing, ...draft };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  public async archive(id: string, archivedAt: Date): Promise<Campaign | null> {
    const existing = this.campaigns.get(id);
    if (!existing) {
      return null;
    }

    const campaign: Campaign = {
      ...existing,
      status: "archived",
      archivedAt,
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }
}

const referenceDraft = {
  name: "  Die Straßen im Nebel  ",
  premise:
    "  Eine Kartografin sucht nach Straßen, die jede Nacht ihren Verlauf ändern.  ",
  genre: " Fantasy ",
  mood: " Geheimnisvoll ",
  templateId: "balanced" as const,
  futureIdeas: null,
  style: defaultCampaignStyle,
};

describe("CampaignService", () => {
  it("validates and normalizes a new campaign", async () => {
    const service = new CampaignService(new InMemoryCampaignRepository());

    const campaign = await service.create(referenceDraft);

    expect(campaign.name).toBe("Die Straßen im Nebel");
    expect(campaign.genre).toBe("Fantasy");
    expect(campaign.status).toBe("active");
    expect(campaign.tension).toBe(3);
  });

  it("updates and archives a campaign", async () => {
    const repository = new InMemoryCampaignRepository();
    const archivedAt = new Date("2026-07-16T20:00:00.000Z");
    const service = new CampaignService(repository, () => archivedAt);
    const campaign = await service.create(referenceDraft);

    const updated = await service.update(campaign.id, {
      ...referenceDraft,
      name: "Die wiedergekehrte Straße",
      genre: "",
    });
    const archived = await service.archive(campaign.id);

    expect(updated.name).toBe("Die wiedergekehrte Straße");
    expect(updated.genre).toBeNull();
    expect(archived.status).toBe("archived");
    expect(archived.archivedAt).toEqual(archivedAt);
    await expect(service.list()).resolves.toEqual([]);
    await expect(service.list(true)).resolves.toHaveLength(1);
  });

  it("rejects missing campaigns", async () => {
    const service = new CampaignService(new InMemoryCampaignRepository());

    await expect(
      service.update("missing", referenceDraft),
    ).rejects.toBeInstanceOf(CampaignNotFoundError);
    await expect(service.archive("missing")).rejects.toBeInstanceOf(
      CampaignNotFoundError,
    );
  });
});
