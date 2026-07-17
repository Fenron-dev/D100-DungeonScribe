import { describe, expect, it } from "vitest";
import type { CampaignEvent } from "@/domain/campaign-event";
import type { CampaignEventRepository } from "@/repositories/campaign-event-repository";
import { CampaignEventService } from "./campaign-event-service";

class InMemoryCampaignEventRepository implements CampaignEventRepository {
  public constructor(private readonly events: CampaignEvent[]) {}

  public async listByCampaign(campaignId: string): Promise<CampaignEvent[]> {
    return this.events.filter((event) => event.campaignId === campaignId);
  }
}

const baseEvent: Omit<CampaignEvent, "id" | "eventType" | "summary"> = {
  campaignId: "campaign-1",
  timestampReal: new Date("2026-07-17T15:00:00.000Z"),
  source: "player",
  reversible: false,
};

const events: CampaignEvent[] = [
  {
    ...baseEvent,
    id: "event-1",
    eventType: "CAMPAIGN_CREATED",
    summary: "Kampagne erstellt",
  },
  {
    ...baseEvent,
    id: "event-2",
    eventType: "ENTITY_CREATED",
    summary: "Weltobjekt erstellt",
  },
  {
    ...baseEvent,
    id: "event-3",
    eventType: "KNOWLEDGE_DISCOVERED",
    summary: "Wissenseintrag erstellt",
    source: "manual",
  },
];

describe("CampaignEventService", () => {
  it("lists the complete immutable campaign history", async () => {
    const service = new CampaignEventService(
      new InMemoryCampaignEventRepository(events),
    );

    await expect(service.list("campaign-1")).resolves.toEqual(events);
  });

  it("filters events by their stable domain category", async () => {
    const service = new CampaignEventService(
      new InMemoryCampaignEventRepository(events),
    );

    await expect(service.list("campaign-1", "knowledge")).resolves.toMatchObject([
      { eventType: "KNOWLEDGE_DISCOVERED" },
    ]);
    await expect(service.list("campaign-1", "world")).resolves.toMatchObject([
      { eventType: "ENTITY_CREATED" },
    ]);
  });

  it("rejects unknown filter categories", async () => {
    const service = new CampaignEventService(
      new InMemoryCampaignEventRepository(events),
    );

    await expect(service.list("campaign-1", "private-data")).rejects.toThrow();
  });
});
