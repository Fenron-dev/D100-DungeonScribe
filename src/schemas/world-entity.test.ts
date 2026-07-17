import { describe, expect, it } from "vitest";
import { worldEntityDraftSchema } from "./world-entity";

describe("worldEntityDraftSchema", () => {
  it("normalizes a shared world entity profile", () => {
    const entity = worldEntityDraftSchema.parse({
      type: "location",
      name: "  Leuchtturm der Nebelwacht  ",
      summary: "  Der letzte sichere Ort an der Nordküste.  ",
      description: " ",
      tags: [" Küste ", "Zuflucht"],
      status: "active",
    });

    expect(entity).toMatchObject({
      name: "Leuchtturm der Nebelwacht",
      description: null,
      tags: ["Küste", "Zuflucht"],
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
    });

    expect(result.success).toBe(false);
  });
});
