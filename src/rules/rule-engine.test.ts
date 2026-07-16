import { describe, expect, it } from "vitest";
import {
  D6PoolRuleEngine,
  InvalidCheckInputError,
  InvalidMechanicalChoiceError,
  InvalidRulesetError,
} from "@/rules/rule-engine";
import { coreAdventureRuleset } from "@/rules/ruleset";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";
import type { CheckInput } from "@/rules/types";

function createInput(overrides: Partial<CheckInput> = {}): CheckInput {
  return {
    characterId: "mara-vey",
    action: "Die verborgene Straße kartografieren",
    archetypeMatches: false,
    matchingTraits: [],
    advantages: [],
    disadvantages: [],
    difficulty: "normal",
    ...overrides,
  };
}

describe("D6PoolRuleEngine", () => {
  it.each([
    { dice: [1], degree: "critical_failure", successes: 0 },
    { dice: [3], degree: "failure", successes: 0 },
    { dice: [5], degree: "success", successes: 1 },
  ] as const)(
    "evaluates $degree from a single die",
    ({ dice, degree, successes }) => {
      const engine = new D6PoolRuleEngine(new FixedRandomSource(dice));

      const result = engine.evaluateCheck(createInput(), coreAdventureRuleset);

      expect(result.degree).toBe(degree);
      expect(result.successes).toBe(successes);
      expect(result.explanation).toMatchObject({ degree, successes });
    },
  );

  it("returns a strong success and exceptional effect for three successes", () => {
    const engine = new D6PoolRuleEngine(
      new FixedRandomSource([5, 6, 6]),
    );

    const result = engine.evaluateCheck(
      createInput({
        archetypeMatches: true,
        matchingTraits: ["Kartografin"],
      }),
      coreAdventureRuleset,
    );

    expect(result.degree).toBe("strong_success");
    expect(result.successes).toBe(3);
    expect(result.effectLevel).toBe(3);
  });

  it("applies archetype and one trait bonus even for multiple traits", () => {
    const engine = new D6PoolRuleEngine(
      new FixedRandomSource([2, 3, 4]),
    );

    const result = engine.evaluateCheck(
      createInput({
        archetypeMatches: true,
        matchingTraits: ["Kartografin", "Ruinenkundig"],
      }),
      coreAdventureRuleset,
    );

    expect(result.diceCount).toBe(3);
    expect(
      result.appliedModifiers.filter(({ kind }) => kind === "trait"),
    ).toHaveLength(1);
  });

  it("records maximum and minimum pool limits", () => {
    const maximumEngine = new D6PoolRuleEngine(
      new FixedRandomSource([2, 3, 4]),
    );
    const maximum = maximumEngine.evaluateCheck(
      createInput({
        archetypeMatches: true,
        matchingTraits: ["Kartografin"],
        advantages: [
          { id: "map", label: "Präzise Karte" },
          { id: "tools", label: "Gutes Werkzeug" },
        ],
      }),
      coreAdventureRuleset,
    );

    const minimumEngine = new D6PoolRuleEngine(new FixedRandomSource([4]));
    const minimum = minimumEngine.evaluateCheck(
      createInput({
        disadvantages: [
          { id: "fog", label: "Dichter Nebel" },
          { id: "dark", label: "Dunkelheit" },
        ],
      }),
      coreAdventureRuleset,
    );

    expect(maximum.diceCount).toBe(3);
    expect(maximum.explanation).toMatchObject({
      requestedDiceCount: 5,
      poolWasLimited: true,
    });
    expect(maximum.appliedModifiers.at(-1)).toMatchObject({
      kind: "pool_limit",
      diceDelta: -2,
    });
    expect(minimum.diceCount).toBe(1);
    expect(minimum.explanation.requestedDiceCount).toBe(-1);
    expect(minimum.appliedModifiers.at(-1)).toMatchObject({
      kind: "pool_limit",
      diceDelta: 2,
    });
  });

  it.each([
    { difficulty: "easy", die: 4, threshold: 4 },
    { difficulty: "normal", die: 5, threshold: 5 },
    { difficulty: "hard", die: 6, threshold: 6 },
  ] as const)(
    "uses the configured $difficulty threshold",
    ({ difficulty, die, threshold }) => {
      const engine = new D6PoolRuleEngine(new FixedRandomSource([die]));

      const result = engine.evaluateCheck(
        createInput({ difficulty }),
        coreAdventureRuleset,
      );

      expect(result.threshold).toBe(threshold);
      expect(result.degree).toBe("success");
    },
  );

  it("offers success with cost only after a normal failure", () => {
    const failureEngine = new D6PoolRuleEngine(new FixedRandomSource([3]));
    const criticalEngine = new D6PoolRuleEngine(new FixedRandomSource([1]));

    expect(
      failureEngine.evaluateCheck(createInput(), coreAdventureRuleset)
        .availableChoices,
    ).toEqual([
      {
        id: "accept_cost",
        resultingDegree: "success_with_cost",
        labelKey: "rules.choice.accept_cost",
      },
    ]);
    expect(
      criticalEngine.evaluateCheck(createInput(), coreAdventureRuleset)
        .availableChoices,
    ).toEqual([]);
  });

  it("resolves the offered choice as success with cost", () => {
    const engine = new D6PoolRuleEngine(new FixedRandomSource([3]));
    const failure = engine.evaluateCheck(createInput(), coreAdventureRuleset);

    const resolved = engine.resolveChoice(failure, "accept_cost");

    expect(resolved.degree).toBe("success_with_cost");
    expect(resolved.effectLevel).toBe(1);
    expect(resolved.availableChoices).toEqual([]);
    expect(() => engine.resolveChoice(resolved, "accept_cost")).toThrow(
      InvalidMechanicalChoiceError,
    );
  });

  it("lets an advantage and disadvantage cancel each other", () => {
    const engine = new D6PoolRuleEngine(new FixedRandomSource([5]));

    const result = engine.evaluateCheck(
      createInput({
        advantages: [{ id: "tools", label: "Gutes Werkzeug" }],
        disadvantages: [{ id: "fog", label: "Dichter Nebel" }],
      }),
      coreAdventureRuleset,
    );

    expect(result.diceCount).toBe(1);
    expect(result.appliedModifiers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "advantage", diceDelta: 1 }),
        expect.objectContaining({ kind: "disadvantage", diceDelta: -1 }),
      ]),
    );
  });

  it("does not treat a rolled one as critical when the pool succeeds", () => {
    const engine = new D6PoolRuleEngine(new FixedRandomSource([1, 5]));

    const result = engine.evaluateCheck(
      createInput({ archetypeMatches: true }),
      coreAdventureRuleset,
    );

    expect(result.degree).toBe("success");
    expect(result.explanation.ones).toBe(1);
  });

  it("rejects invalid rulesets with structured issues", () => {
    const engine = new D6PoolRuleEngine(new FixedRandomSource([4]));
    const invalidRuleset = {
      ...coreAdventureRuleset,
      checkMechanic: {
        ...coreAdventureRuleset.checkMechanic,
        baseDice: 5,
        minDice: 3,
        maxDice: 2,
        thresholds: { easy: 6, normal: 5, hard: 4 },
      },
    };

    const validation = engine.validateRuleset(invalidRuleset);

    expect(validation.valid).toBe(false);
    if (!validation.valid) {
      expect(validation.issues.length).toBeGreaterThanOrEqual(2);
      expect(validation.issues.map(({ path }) => path)).toContain(
        "checkMechanic.thresholds",
      );
    }
    expect(() => engine.evaluateCheck(createInput(), invalidRuleset)).toThrow(
      InvalidRulesetError,
    );
  });

  it("rejects duplicate modifier IDs", () => {
    const engine = new D6PoolRuleEngine(new FixedRandomSource([4]));
    const duplicate = { id: "weather", label: "Wetter" };

    expect(() =>
      engine.evaluateCheck(
        createInput({
          advantages: [duplicate],
          disadvantages: [duplicate],
        }),
        coreAdventureRuleset,
      ),
    ).toThrow(InvalidCheckInputError);
  });
});
