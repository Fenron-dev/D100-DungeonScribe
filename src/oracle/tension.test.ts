import { describe, expect, it } from "vitest";
import { adjustTension, evaluateDoubleEventTrigger } from "@/oracle/tension";

describe("campaign tension", () => {
  it("adjusts tension by one and limits it to one through six", () => {
    expect(adjustTension(3, "increase")).toMatchObject({ next: 4, wasLimited: false });
    expect(adjustTension(1, "decrease")).toMatchObject({ next: 1, wasLimited: true });
    expect(adjustTension(6, "increase")).toMatchObject({ next: 6, wasLimited: true });
  });

  it("triggers only when a double is at most the current tension", () => {
    expect(evaluateDoubleEventTrigger([3, 3], 3)).toBe(true);
    expect(evaluateDoubleEventTrigger([4, 4], 3)).toBe(false);
    expect(evaluateDoubleEventTrigger([2, 5], 6)).toBe(false);
  });
});
