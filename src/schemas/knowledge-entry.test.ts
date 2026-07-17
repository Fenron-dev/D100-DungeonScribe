import { describe, expect, it } from "vitest";
import { knowledgeEntryDraftSchema } from "./knowledge-entry";

describe("knowledgeEntryDraftSchema", () => {
  it("normalizes a structured secret", () => {
    const entry = knowledgeEntryDraftSchema.parse({
      title: "  Das Licht der Nebelwacht  ",
      content: "  Der Leuchtturm zieht die Kreaturen an.  ",
      type: "secret",
      truthStatus: "true",
      knownByCharacterIds: ["character-1"],
      relatedEntityIds: ["entity-1"],
      locked: true,
    });

    expect(entry).toMatchObject({
      title: "Das Licht der Nebelwacht",
      content: "Der Leuchtturm zieht die Kreaturen an.",
      locked: true,
    });
  });

  it("rejects duplicate visibility references", () => {
    const result = knowledgeEntryDraftSchema.safeParse({
      title: "Doppeltes Wissen",
      content: "Ein ungültiger Eintrag.",
      type: "rumor",
      truthStatus: "unknown",
      knownByCharacterIds: ["character-1", "character-1"],
      relatedEntityIds: [],
      locked: false,
    });

    expect(result.success).toBe(false);
  });
});
