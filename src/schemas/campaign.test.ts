import { describe, expect, it } from "vitest";
import { campaignDraftSchema } from "./campaign";

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
});
