import { describe, expect, it } from "vitest";
import {
  worldEntityDraftSchema,
  worldEntityRelationDraftSchema,
} from "./world-entity";

describe("worldEntityDraftSchema", () => {
  it("normalizes a shared world entity profile", () => {
    const entity = worldEntityDraftSchema.parse({
      type: "location",
      name: "  Leuchtturm der Nebelwacht  ",
      summary: "  Der letzte sichere Ort an der Nordküste.  ",
      description: " ",
      tags: [" Küste ", "Zuflucht"],
      status: "active",
      details: { type: "location", region: " Nordmark ", atmosphere: " Neblig " },
    });

    expect(entity).toMatchObject({
      name: "Leuchtturm der Nebelwacht",
      description: null,
      tags: ["Küste", "Zuflucht"],
      details: {
        type: "location",
        region: "Nordmark",
        atmosphere: "Neblig",
      },
    });
    expect(worldEntityDraftSchema.parse(entity)).toEqual(entity);
  });

  it("rejects duplicate tags regardless of casing", () => {
    const result = worldEntityDraftSchema.safeParse({
      type: "npc",
      name: "Aldric",
      summary: "Ein wortkarger Lotse.",
      description: null,
      tags: ["Lotse", "lotse"],
      status: "active",
      details: { type: "npc", role: "Lotse", motivation: null },
    });

    expect(result.success).toBe(false);
  });

  it("rejects details that do not match the entity type", () => {
    const result = worldEntityDraftSchema.safeParse({
      type: "item",
      name: "Nebelkompass",
      summary: "Zeigt Wege durch den Nebel.",
      description: null,
      tags: [],
      status: "active",
      details: { type: "npc", role: "Lotse", motivation: null },
    });

    expect(result.success).toBe(false);
  });
});

describe("worldEntityRelationDraftSchema", () => {
  it("normalizes an optional relation description", () => {
    expect(worldEntityRelationDraftSchema.parse({
      targetEntityId: "entity-2",
      type: "member_of",
      description: "  Enger Verbündeter  ",
      status: "active",
    })).toMatchObject({ description: "Enger Verbündeter" });
  });
});
