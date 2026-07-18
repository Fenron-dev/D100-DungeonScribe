import { describe, expect, it } from "vitest";
import { InspirationOracle } from "@/oracle/inspiration-oracle";
import {
  inspirationTables,
} from "@/oracle/types";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";

describe("InspirationOracle", () => {
  it("draws reproducible terms and explains both table positions", () => {
    const result = new InspirationOracle(new FixedRandomSource([2, 4])).draw(
      "action",
      "danger",
    );
    expect(result).toMatchObject({
      primaryTermId: "action.transform",
      secondaryTermId: "danger.exposure",
      explanation: {
        primaryIndex: 2,
        primaryTableSize: 5,
        secondaryIndex: 4,
        secondaryTableSize: 5,
      },
    });
  });

  it("provides a non-empty stable table for every category", () => {
    for (const [category, terms] of Object.entries(inspirationTables)) {
      expect(terms.length).toBeGreaterThanOrEqual(5);
      expect(new Set(terms).size).toBe(terms.length);
      expect(terms.every((term) => term.startsWith(`${category}.`))).toBe(true);
    }
  });

  it("can draw twice from the same category", () => {
    const result = new InspirationOracle(new FixedRandomSource([0, 1])).draw(
      "theme",
      "theme",
    );
    expect(result.primaryTermId).toBe("theme.debt");
    expect(result.secondaryTermId).toBe("theme.freedom");
  });
});
