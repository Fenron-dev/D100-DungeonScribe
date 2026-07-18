import { describe, expect, it } from "vitest";
import { MockCreativeDraftProvider } from "@/ai/mock-creative-draft-provider";
import type { CreativeDraftRequest } from "@/ai/creative-draft-provider";
import { campaignDraftSchema } from "@/schemas/campaign";
import { characterDraftSchema } from "@/schemas/character";
import { worldEntityDraftSchema } from "@/schemas/world-entity";
import { defaultCampaignStyle } from "@/domain/campaign-style";

const request: CreativeDraftRequest = {
  locale: "de",
  preference: "",
  variation: 1,
  campaign: {
    name: "Nebelpfade",
    premise: "Verlorene Wege kehren zurück.",
    genre: "Fantasy",
    mood: "Unheimlich",
    templateId: "balanced",
    futureIdeas: null,
    style: defaultCampaignStyle,
  },
};

describe("MockCreativeDraftProvider", () => {
  it("returns valid campaign, character, and world drafts without a network", async () => {
    const provider = new MockCreativeDraftProvider();
    expect(campaignDraftSchema.parse(await provider.generateCampaign(request)).name).not.toBe("");
    expect(characterDraftSchema.parse(await provider.generateCharacter(request)).traits).not.toHaveLength(0);
    expect(worldEntityDraftSchema.parse(await provider.generateWorldEntity(request)).summary).not.toBe("");
  });

  it("uses the injected variation for reproducible alternatives", async () => {
    const provider = new MockCreativeDraftProvider();
    const first = await provider.generateCampaign({ ...request, variation: 0 });
    const again = await provider.generateCampaign({ ...request, variation: 0 });
    const alternative = await provider.generateCampaign({ ...request, variation: 2 });
    expect(again).toEqual(first);
    expect(alternative).not.toEqual(first);
  });
});
