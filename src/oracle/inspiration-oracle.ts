import type { RandomSource } from "@/rules/random-source";
import {
  inspirationTables,
  type InspirationCategory,
  type InspirationResult,
  type InspirationTermId,
} from "@/oracle/types";

export class InvalidInspirationTableError extends Error {
  public constructor(category: InspirationCategory) {
    super(`Inspiration table ${category} is empty or invalid.`);
    this.name = "InvalidInspirationTableError";
  }
}

export class InspirationOracle {
  public constructor(private readonly randomSource: RandomSource) {}

  private drawTerm(category: InspirationCategory) {
    const table: readonly InspirationTermId[] = inspirationTables[category];
    if (table.length === 0) throw new InvalidInspirationTableError(category);
    const index = this.randomSource.nextInt(0, table.length - 1);
    const termId = table[index];
    if (!termId) throw new InvalidInspirationTableError(category);
    return { termId, index, tableSize: table.length };
  }

  public draw(
    primaryCategory: InspirationCategory,
    secondaryCategory: InspirationCategory,
  ): InspirationResult {
    const primary = this.drawTerm(primaryCategory);
    const secondary = this.drawTerm(secondaryCategory);
    return {
      primaryTermId: primary.termId,
      secondaryTermId: secondary.termId,
      explanation: {
        primaryCategory,
        primaryIndex: primary.index,
        primaryTableSize: primary.tableSize,
        secondaryCategory,
        secondaryIndex: secondary.index,
        secondaryTableSize: secondary.tableSize,
      },
    };
  }
}
