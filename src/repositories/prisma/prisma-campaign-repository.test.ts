import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaCharacterRepository } from "./prisma-character-repository";
import { PrismaCampaignRepository } from "./prisma-campaign-repository";
import { PrismaWorldEntityRepository } from "./prisma-world-entity-repository";

const testDatabaseUrl = process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("DATABASE_URL must reference the migrated CI test database.");
}

const client = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: testDatabaseUrl }),
});
const repository = new PrismaCampaignRepository(client);
const characterRepository = new PrismaCharacterRepository(client);
const worldEntityRepository = new PrismaWorldEntityRepository(client);

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

  it("persists character profiles with traceable events", async () => {
    const campaign = await repository.create(draft);
    const characterDraft = {
      name: "Elara Venn",
      concept: "Ehemalige Hofmagierin auf der Suche nach ihrem Bruder",
      archetype: "insightful" as const,
      traits: ["Gebildet", "Arkane Wahrnehmung"],
      flaw: null,
      notes: "",
    };

    const character = await characterRepository.create(campaign.id, characterDraft);
    if (!character) {
      throw new Error("Expected character creation to succeed.");
    }
    await characterRepository.update(campaign.id, character.id, {
      ...characterDraft,
      name: "Elara aus dem Nebel",
    });

    await expect(characterRepository.listByCampaign(campaign.id)).resolves.toMatchObject(
      [{ name: "Elara aus dem Nebel", flaw: null }],
    );
    const eventTypes = await client.campaignEvent.findMany({
      where: { campaignId: campaign.id },
      orderBy: { timestampReal: "asc" },
      select: { eventType: true },
    });
    expect(eventTypes.map(({ eventType }) => eventType)).toEqual([
      "CAMPAIGN_CREATED",
      "CHARACTER_CREATED",
      "CHARACTER_UPDATED",
    ]);
  });

  it("persists world entities with traceable events", async () => {
    const campaign = await repository.create(draft);
    const entityDraft = {
      type: "location" as const,
      name: "Leuchtturm der Nebelwacht",
      summary: "Der letzte sichere Ort an der Nordküste.",
      description: null,
      tags: ["Küste", "Zuflucht"],
      status: "active" as const,
    };

    const entity = await worldEntityRepository.create(campaign.id, entityDraft);
    if (!entity) {
      throw new Error("Expected world entity creation to succeed.");
    }
    await worldEntityRepository.update(campaign.id, entity.id, {
      ...entityDraft,
      name: "Die Nebelwacht",
    });

    await expect(
      worldEntityRepository.listByCampaign(campaign.id),
    ).resolves.toMatchObject([{ name: "Die Nebelwacht", type: "location" }]);
    const eventTypes = await client.campaignEvent.findMany({
      where: { campaignId: campaign.id },
      orderBy: { timestampReal: "asc" },
      select: { eventType: true },
    });
    expect(eventTypes.map(({ eventType }) => eventType)).toEqual([
      "CAMPAIGN_CREATED",
      "ENTITY_CREATED",
      "ENTITY_UPDATED",
    ]);
  });
});
