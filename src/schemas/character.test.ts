import { describe, expect, it } from "vitest";
import { characterDraftSchema } from "./character";

describe("characterDraftSchema", () => {
  it("normalizes the core character profile", () => {
    const character = characterDraftSchema.parse({
      name: "  Elara Venn  ",
      concept: "  Ehemalige Hofmagierin auf der Suche nach ihrem Bruder  ",
      archetype: "insightful",
      traits: [" Gebildet ", "Arkane Wahrnehmung"],
      flaw: " ",
      notes: "  Vertraut alten Karten nicht.  ",
    });

    expect(character).toMatchObject({
      name: "Elara Venn",
      archetype: "insightful",
      traits: ["Gebildet", "Arkane Wahrnehmung"],
      flaw: null,
      notes: "Vertraut alten Karten nicht.",
    });
    expect(characterDraftSchema.parse(character)).toEqual(character);
  });

  it("requires one to three distinct traits", () => {
    const base = {
      name: "Elara Venn",
      concept: "Ehemalige Hofmagierin",
      archetype: "insightful",
      flaw: null,
      notes: "",
    };

    expect(characterDraftSchema.safeParse({ ...base, traits: [] }).success).toBe(
      false,
    );
    expect(
      characterDraftSchema.safeParse({
        ...base,
        traits: ["Gebildet", "Gebildet"],
      }).success,
    ).toBe(false);
  });
});
