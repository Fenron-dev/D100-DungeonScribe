export const difficulties = ["easy", "normal", "hard"] as const;

export type Difficulty = (typeof difficulties)[number];

export type OutcomeDegree =
  | "critical_failure"
  | "failure"
  | "success_with_cost"
  | "success"
  | "strong_success";

export interface CheckModifier {
  id: string;
  label: string;
}

export type AppliedModifierKind =
  | "archetype"
  | "trait"
  | "advantage"
  | "disadvantage"
  | "pool_limit";

export interface AppliedModifier {
  id: string;
  kind: AppliedModifierKind;
  diceDelta: number;
  label: string | null;
  labelKey: string | null;
}

export interface MechanicalChoice {
  id: "accept_cost";
  resultingDegree: "success_with_cost";
  labelKey: "rules.choice.accept_cost";
}

export interface CheckInput {
  characterId: string;
  action: string;
  archetypeMatches: boolean;
  matchingTraits: string[];
  advantages: CheckModifier[];
  disadvantages: CheckModifier[];
  difficulty: Difficulty;
}

export interface CheckExplanation {
  baseDice: number;
  requestedDiceCount: number;
  diceCount: number;
  poolWasLimited: boolean;
  threshold: number;
  successes: number;
  ones: number;
  degree: OutcomeDegree;
}

export interface CheckResult {
  dice: number[];
  diceCount: number;
  threshold: number;
  successes: number;
  degree: OutcomeDegree;
  effectLevel: number;
  appliedModifiers: AppliedModifier[];
  availableChoices: MechanicalChoice[];
  explanation: CheckExplanation;
}

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export type RulesetValidationResult<Ruleset> =
  | { valid: true; ruleset: Ruleset; issues: [] }
  | { valid: false; ruleset: null; issues: ValidationIssue[] };
