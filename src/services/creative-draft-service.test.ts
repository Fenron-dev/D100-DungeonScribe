import { describe, expect, it } from "vitest";
import type {
  CreativeDraftProvider,
  CreativeDraftRequest,
} from "@/ai/creative-draft-provider";
import type { CampaignDraft } from "@/domain/campaign";
import { defaultCampaignStyle } from "@/domain/campaign-style";
import type { CharacterDraft } from "@/domain/character";
import type { WorldEntityDraft } from "@/domain/world-entity";
import type { SceneDraft } from "@/domain/scene";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";
import { CreativeDraftService } from "@/services/creative-draft-service";

class CapturingProvider implements CreativeDraftProvider {
  public request: CreativeDraftRequest | null = null;
  public async generateCampaign(request: CreativeDraftRequest): Promise<CampaignDraft> {
    this.request = request;
    return {
      name: "Test",
      premise: "Eine Idee",
      genre: null,
      mood: null,
      templateId: "balanced",
      futureIdeas: null,
      style: defaultCampaignStyle,
    };
  }
  public async generateCharacter(request: CreativeDraftRequest): Promise<CharacterDraft> {
    this.request = request;
    return {
      name: "Mara",
      concept: "Reisende",
      archetype: "agile",
      traits: ["Schnell"],
      flaw: null,
      notes: "",
    };
  }
  public async generateWorldEntity(request: CreativeDraftRequest): Promise<WorldEntityDraft> {
    this.request = request;
    return {
      type: "item",
      name: "Kompass",
      summary: "Zeigt auf verlorene Wege.",
      description: null,
      tags: [],
      status: "active",
      details: { type: "item", purpose: "Wegweiser", rarity: "Selten" },
    };
  }
  public async generateScene(request: CreativeDraftRequest): Promise<SceneDraft> {
    this.request = request;
    return {
      title: "Beginn",
      locationId: null,
      expectedSetup: "Eine erwartete Lage.",
      actualSetup: "Ein überraschender Beginn.",
      objective: null,
      participantCharacterIds: [],
      participantEntityIds: [],
      relevantThreadIds: [],
    };
  }
}

describe("CreativeDraftService", () => {
  it("injects a reproducible variation and only the supplied campaign frame", async () => {
    const provider = new CapturingProvider();
    const service = new CreativeDraftService(provider, new FixedRandomSource([17]));
    const campaign = {
      name: "Nebelpfade",
      premise: "Verlorene Wege kehren zurück.",
      genre: null,
      mood: null,
      templateId: "balanced" as const,
      futureIdeas: null,
      style: defaultCampaignStyle,
    };
    await service.generateCharacter("Überraschend", campaign);
    expect(provider.request).toEqual({
      locale: "de",
      preference: "Überraschend",
      variation: 17,
      campaign,
    });
  });
});
