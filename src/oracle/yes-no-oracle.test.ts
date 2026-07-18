import { describe, expect, it } from "vitest";
import { YesNoOracle } from "@/oracle/yes-no-oracle";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";

describe("YesNoOracle", () => {
  it.each([
    { dice: [1, 1], answer: "no_and", adjustedTotal: 2 },
    { dice: [1, 3], answer: "no", adjustedTotal: 4 },
    { dice: [3, 3], answer: "no_but", adjustedTotal: 6 },
    { dice: [3, 4], answer: "uncertain", adjustedTotal: 7 },
    { dice: [4, 4], answer: "yes_but", adjustedTotal: 8 },
    { dice: [5, 5], answer: "yes", adjustedTotal: 10 },
    { dice: [6, 6], answer: "yes_and", adjustedTotal: 12 },
  ] as const)("maps $adjustedTotal to $answer", ({ dice, answer, adjustedTotal }) => {
    const oracle = new YesNoOracle(new FixedRandomSource([...dice]));
    const result = oracle.ask("even", 3);
    expect(result.answer).toBe(answer);
    expect(result.adjustedTotal).toBe(adjustedTotal);
  });

  it.each([
    { likelihood: "nearly_impossible", modifier: -4 },
    { likelihood: "unlikely", modifier: -2 },
    { likelihood: "even", modifier: 0 },
    { likelihood: "likely", modifier: 2 },
    { likelihood: "nearly_certain", modifier: 4 },
  ] as const)("applies the $likelihood modifier", ({ likelihood, modifier }) => {
    const result = new YesNoOracle(new FixedRandomSource([3, 4])).ask(likelihood, 3);
    expect(result.modifier).toBe(modifier);
    expect(result.adjustedTotal).toBe(7 + modifier);
  });

  it("limits the adjusted result and records a double", () => {
    const low = new YesNoOracle(new FixedRandomSource([1, 1])).ask("nearly_impossible", 3);
    const high = new YesNoOracle(new FixedRandomSource([6, 6])).ask("nearly_certain", 3);
    expect(low).toMatchObject({ adjustedTotal: 2, isDouble: true });
    expect(low.explanation.wasLimited).toBe(true);
    expect(high).toMatchObject({ adjustedTotal: 12, isDouble: true });
    expect(high.explanation.wasLimited).toBe(true);
  });

  it("records the transparent tension rule for random events", () => {
    const triggered = new YesNoOracle(new FixedRandomSource([3, 3])).ask("even", 3);
    const notTriggered = new YesNoOracle(new FixedRandomSource([4, 4])).ask("even", 3);
    expect(triggered).toMatchObject({ tensionAtRoll: 3, randomEventTriggered: true });
    expect(notTriggered).toMatchObject({ tensionAtRoll: 3, randomEventTriggered: false });
  });
});
