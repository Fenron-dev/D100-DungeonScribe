import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaCampaignRepository } from "./prisma-campaign-repository";

const testDatabaseUrl = process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("DATABASE_URL must reference the migrated CI test database.");
}

const client = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: testDatabaseUrl }),
});
const repository = new PrismaCampaignRepository(client);

const draft = {
  name: "Die Straßen im Nebel",
  premise: "Eine verschwundene Straße ist nach zwanzig Jahren zurückgekehrt.",
  genre: "Fantasy",
  mood: "Geheimnisvoll",
};

describe("PrismaCampaignRepository", () => {
  beforeEach(async () => {
    await client.campaign.deleteMany();
  });

  afterAll(async () => {
    await client.$disconnect();
  });

  it("persists a campaign and its creation event", async () => {
    const campaign = await repository.create(draft);

    await expect(repository.findById(campaign.id)).resolves.toMatchObject(draft);
    await expect(
      client.campaignEvent.findMany({ where: { campaignId: campaign.id } }),
    ).resolves.toMatchObject([
      {
        eventType: "CAMPAIGN_CREATED",
        source: "player",
        reversible: false,
      },
    ]);
  });

  it("updates and archives with traceable events", async () => {
    const campaign = await repository.create(draft);
    const archivedAt = new Date("2026-07-16T20:00:00.000Z");

    await repository.update(campaign.id, {
      ...draft,
      name: "Die wiedergekehrte Straße",
    });
    const archived = await repository.archive(campaign.id, archivedAt);
    const eventTypes = await client.campaignEvent.findMany({
      where: { campaignId: campaign.id },
      orderBy: { timestampReal: "asc" },
      select: { eventType: true },
    });

    expect(archived).toMatchObject({
      status: "archived",
      archivedAt,
    });
    expect(eventTypes.map(({ eventType }) => eventType)).toEqual([
      "CAMPAIGN_CREATED",
      "CAMPAIGN_UPDATED",
      "CAMPAIGN_ARCHIVED",
    ]);
    await expect(repository.list({ includeArchived: false })).resolves.toEqual(
      [],
    );
  });
});
