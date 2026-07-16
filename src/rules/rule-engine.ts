import { z } from "zod";
import type { RandomSource } from "@/rules/random-source";
import { rulesetSchema, type Ruleset } from "@/rules/ruleset";
import {
  difficulties,
  type AppliedModifier,
  type CheckInput,
  type CheckResult,
  type MechanicalChoice,
  type OutcomeDegree,
  type RulesetValidationResult,
  type ValidationIssue,
} from "@/rules/types";

const modifierSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
});

const checkInputSchema = z
  .object({
    characterId: z.string().trim().min(1).max(80),
    action: z.string().trim().min(1).max(500),
    archetypeMatches: z.boolean(),
    matchingTraits: z.array(z.string().trim().min(1).max(120)).max(20),
    advantages: z.array(modifierSchema).max(20),
    disadvantages: z.array(modifierSchema).max(20),
    difficulty: z.enum(difficulties),
  })
  .superRefine((input, context) => {
    const modifierIds = [
      ...input.advantages.map(({ id }) => id),
      ...input.disadvantages.map(({ id }) => id),
    ];
    if (new Set(modifierIds).size !== modifierIds.length) {
      context.addIssue({
        code: "custom",
        path: ["advantages"],
        message: "Modifier IDs must be unique within a check.",
      });
    }
  });

export class InvalidRulesetError extends Error {
  public constructor(public readonly issues: ValidationIssue[]) {
    super("Ruleset validation failed.");
    this.name = "InvalidRulesetError";
  }
}

export class InvalidCheckInputError extends Error {
  public constructor(public readonly issues: ValidationIssue[]) {
    super("Check input validation failed.");
    this.name = "InvalidCheckInputError";
  }
}

export class InvalidMechanicalChoiceError extends Error {
  public constructor() {
    super("Mechanical choice is not available for this result.");
    this.name = "InvalidMechanicalChoiceError";
  }
}

interface SchemaIssue {
  path: readonly PropertyKey[];
  code: string;
  message: string;
}

function mapIssues(issues: readonly SchemaIssue[]): ValidationIssue[] {
  return issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    code: issue.code,
    message: issue.message,
  }));
}

function determineDegree(
  successes: number,
  ones: number,
  criticalFailureRequiresOne: boolean,
): OutcomeDegree {
  if (successes === 0) {
    return criticalFailureRequiresOne && ones > 0
      ? "critical_failure"
      : "failure";
  }

  return successes === 1 ? "success" : "strong_success";
}

export class D6PoolRuleEngine {
  public constructor(private readonly randomSource: RandomSource) {}

  public validateRuleset(ruleset: unknown): RulesetValidationResult<Ruleset> {
    const result = rulesetSchema.safeParse(ruleset);
    if (!result.success) {
      return {
        valid: false,
        ruleset: null,
        issues: mapIssues(result.error.issues),
      };
    }

    return { valid: true, ruleset: result.data, issues: [] };
  }

  public evaluateCheck(input: CheckInput, ruleset: unknown): CheckResult {
    const rulesetResult = this.validateRuleset(ruleset);
    if (!rulesetResult.valid) {
      throw new InvalidRulesetError(rulesetResult.issues);
    }

    const inputResult = checkInputSchema.safeParse(input);
    if (!inputResult.success) {
      throw new InvalidCheckInputError(mapIssues(inputResult.error.issues));
    }

    const validatedInput = inputResult.data;
    const mechanic = rulesetResult.ruleset.checkMechanic;
    const appliedModifiers: AppliedModifier[] = [];
    let requestedDiceCount = mechanic.baseDice;

    const applySystemModifier = (
      id: string,
      kind: "archetype" | "trait",
      diceDelta: number,
      labelKey: string,
      label: string | null = null,
    ) => {
      if (diceDelta === 0) {
        return;
      }
      requestedDiceCount += diceDelta;
      appliedModifiers.push({
        id,
        kind,
        diceDelta,
        label,
        labelKey,
      });
    };

    if (validatedInput.archetypeMatches) {
      applySystemModifier(
        "matching-archetype",
        "archetype",
        mechanic.archetypeBonus,
        "rules.modifier.matching_archetype",
      );
    }

    if (validatedInput.matchingTraits.length > 0) {
      applySystemModifier(
        "matching-trait",
        "trait",
        mechanic.traitBonus,
        "rules.modifier.matching_trait",
        validatedInput.matchingTraits.join(", "),
      );
    }

    for (const advantage of validatedInput.advantages) {
      requestedDiceCount += mechanic.advantageBonus;
      appliedModifiers.push({
        id: advantage.id,
        kind: "advantage",
        diceDelta: mechanic.advantageBonus,
        label: advantage.label,
        labelKey: null,
      });
    }

    for (const disadvantage of validatedInput.disadvantages) {
      requestedDiceCount -= mechanic.disadvantagePenalty;
      appliedModifiers.push({
        id: disadvantage.id,
        kind: "disadvantage",
        diceDelta: -mechanic.disadvantagePenalty,
        label: disadvantage.label,
        labelKey: null,
      });
    }

    const diceCount = Math.min(
      mechanic.maxDice,
      Math.max(mechanic.minDice, requestedDiceCount),
    );
    if (diceCount !== requestedDiceCount) {
      appliedModifiers.push({
        id: "pool-limit",
        kind: "pool_limit",
        diceDelta: diceCount - requestedDiceCount,
        label: null,
        labelKey: "rules.modifier.pool_limit",
      });
    }

    const dice = Array.from({ length: diceCount }, () =>
      this.randomSource.nextInt(1, 6),
    );
    const threshold = mechanic.thresholds[validatedInput.difficulty];
    const successes = dice.filter((die) => die >= threshold).length;
    const ones = dice.filter((die) => die === 1).length;
    const degree = determineDegree(
      successes,
      ones,
      mechanic.criticalFailureRequiresOne,
    );
    const availableChoices: MechanicalChoice[] =
      degree === "failure" && mechanic.offerSuccessWithCost
        ? [
            {
              id: "accept_cost",
              resultingDegree: "success_with_cost",
              labelKey: "rules.choice.accept_cost",
            },
          ]
        : [];

    return {
      dice,
      diceCount,
      threshold,
      successes,
      degree,
      effectLevel: successes,
      appliedModifiers,
      availableChoices,
      explanation: {
        baseDice: mechanic.baseDice,
        requestedDiceCount,
        diceCount,
        poolWasLimited: diceCount !== requestedDiceCount,
        threshold,
        successes,
        ones,
        degree,
      },
    };
  }

  public resolveChoice(
    result: CheckResult,
    choiceId: MechanicalChoice["id"],
  ): CheckResult {
    const choice = result.availableChoices.find(({ id }) => id === choiceId);
    if (!choice) {
      throw new InvalidMechanicalChoiceError();
    }

    return {
      ...result,
      degree: choice.resultingDegree,
      effectLevel: 1,
      availableChoices: [],
      explanation: {
        ...result.explanation,
        degree: choice.resultingDegree,
      },
    };
  }
}
