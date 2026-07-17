import { describe, expect, it } from "vitest";
import type {
  KnowledgeEntry,
  KnowledgeEntryDraft,
} from "@/domain/knowledge-entry";
import type { KnowledgeEntryRepository } from "@/repositories/knowledge-entry-repository";
import {
  KnowledgeEntryNotFoundError,
  KnowledgeEntryService,
} from "./knowledge-entry-service";

class InMemoryKnowledgeEntryRepository implements KnowledgeEntryRepository {
  private entry: KnowledgeEntry | null = null;

  public async create(
    campaignId: string,
    draft: KnowledgeEntryDraft,
  ): Promise<KnowledgeEntry | null> {
    if (campaignId === "missing") return null;
    const now = new Date("2026-07-17T13:00:00.000Z");
    this.entry = {
      id: "knowledge-1",
      campaignId,
      ...draft,
      sourceEventId: "event-1",
      createdAt: now,
      updatedAt: now,
    };
    return this.entry;
  }

  public async findById(campaignId: string, entryId: string) {
    return this.entry?.campaignId === campaignId && this.entry.id === entryId
      ? this.entry
      : null;
  }

  public async listByCampaign(campaignId: string) {
    return this.entry?.campaignId === campaignId ? [this.entry] : [];
  }

  public async update(
    campaignId: string,
    entryId: string,
    draft: KnowledgeEntryDraft,
  ) {
    const entry = await this.findById(campaignId, entryId);
    if (!entry) return null;
    this.entry = { ...entry, ...draft };
    return this.entry;
  }
}

const draft = {
  title: " Das Licht der Nebelwacht ",
  content: " Der Turm zieht die Kreaturen an. ",
  type: "secret",
  truthStatus: "true",
  knownByCharacterIds: ["character-1"],
  relatedEntityIds: ["entity-1"],
  locked: true,
};

describe("KnowledgeEntryService", () => {
  it("creates, lists, and updates normalized knowledge", async () => {
    const service = new KnowledgeEntryService(
      new InMemoryKnowledgeEntryRepository(),
    );
    const entry = await service.create("campaign-1", draft);
    const updated = await service.update("campaign-1", entry.id, {
      ...draft,
      title: "Die Wahrheit der Nebelwacht",
    });

    expect(entry.title).toBe("Das Licht der Nebelwacht");
    expect(updated.title).toBe("Die Wahrheit der Nebelwacht");
    await expect(service.list("campaign-1")).resolves.toHaveLength(1);
  });

  it("rejects missing campaign and entry references", async () => {
    const service = new KnowledgeEntryService(
      new InMemoryKnowledgeEntryRepository(),
    );

    await expect(service.create("missing", draft)).rejects.toBeInstanceOf(
      KnowledgeEntryNotFoundError,
    );
    await expect(
      service.update("campaign-1", "missing", draft),
    ).rejects.toBeInstanceOf(KnowledgeEntryNotFoundError);
  });
});
