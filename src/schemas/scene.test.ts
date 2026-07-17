import { describe, expect, it } from "vitest";
import { sceneDraftSchema, sceneSummarySchema } from "./scene";

const validScene = {
  title: " Die Straße im Nebel ",
  locationId: "entity-1",
  expectedSetup: " Mara erreicht die Nebelwacht. ",
  actualSetup: " Mara hört Schritte im leeren Turm. ",
  objective: " Den Ursprung der Schritte finden. ",
  participantCharacterIds: ["character-1"],
  participantEntityIds: ["entity-2"],
  relevantThreadIds: ["thread-1"],
};

describe("sceneDraftSchema", () => {
  it("normalizes a scene setup with explicit references", () => {
    expect(sceneDraftSchema.parse(validScene)).toMatchObject({
      title: "Die Straße im Nebel",
      expectedSetup: "Mara erreicht die Nebelwacht.",
      objective: "Den Ursprung der Schritte finden.",
    });
  });

  it("allows a scene without fixed location or objective", () => {
    expect(
      sceneDraftSchema.parse({
        ...validScene,
        locationId: "",
        objective: "",
      }),
    ).toMatchObject({ locationId: null, objective: null });
  });
});

describe("sceneSummarySchema", () => {
  it("requires a meaningful scene summary", () => {
    expect(sceneSummarySchema.safeParse("   ").success).toBe(false);
    expect(sceneSummarySchema.parse("  Mara entdeckt eine verborgene Karte.  ")).toBe(
      "Mara entdeckt eine verborgene Karte.",
    );
  });
});
