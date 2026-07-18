import { describe, expect, it } from "vitest";
import { campaignDraftSchema } from "./campaign";
import { defaultCampaignStyle } from "@/domain/campaign-style";

describe("campaignDraftSchema", () => {
  it("requires a name and premise", () => {
    const result = campaignDraftSchema.safeParse({
      name: "",
      premise: "",
      genre: "",
      mood: "",
    });

    expect(result.success).toBe(false);
  });

  it("turns empty optional fields into null", () => {
    const result = campaignDraftSchema.parse({
      name: "Die Straßen im Nebel",
      premise: "Eine verschwundene Straße ist zurückgekehrt.",
      genre: " ",
      mood: "",
    });

    expect(result.genre).toBeNull();
    expect(result.mood).toBeNull();
    expect(result.templateId).toBe("balanced");
    expect(result.style).toEqual(defaultCampaignStyle);
  });

  it("accepts an already normalized draft", () => {
    const normalizedDraft = campaignDraftSchema.parse({
      name: "Die Straßen im Nebel",
      premise: "Eine verschwundene Straße ist zurückgekehrt.",
      genre: "",
      mood: "",
    });

    expect(campaignDraftSchema.parse(normalizedDraft)).toEqual(normalizedDraft);
  });

  it("stores future ideas as possibilities and validates play-style values", () => {
    const result = campaignDraftSchema.parse({
      name: "Die Straßen im Nebel",
      premise: "Eine verschwundene Straße ist zurückgekehrt.",
      genre: "Fantasy",
      mood: "Geheimnisvoll",
      templateId: "loot",
      futureIdeas: "Später soll eine intelligente Karte auftauchen.",
      style: { ...defaultCampaignStyle, lootAmount: 5 },
    });

    expect(result.futureIdeas).toContain("intelligente Karte");
    expect(result.style.lootAmount).toBe(5);
    expect(
      campaignDraftSchema.safeParse({
        ...result,
        style: { ...result.style, danger: 8 },
      }).success,
    ).toBe(false);
  });
});
