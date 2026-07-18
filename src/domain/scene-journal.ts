import type { CheckInput, CheckResult, Difficulty } from "@/rules/types";

export const sceneNoteKinds = ["action", "observation"] as const;
export type SceneNoteKind = (typeof sceneNoteKinds)[number];

export interface SceneNoteDraft {
  kind: SceneNoteKind;
  content: string;
}

export interface SceneNote extends SceneNoteDraft {
  id: string;
  campaignId: string;
  sceneId: string;
  createdAt: Date;
}

export interface DiceRollDraft {
  characterId: string;
  action: string;
  difficulty: Difficulty;
  archetypeMatches: boolean;
  matchingTrait: string | null;
  advantage: string | null;
  disadvantage: string | null;
}

export interface DiceRoll {
  id: string;
  campaignId: string;
  sceneId: string;
  characterId: string;
  action: string;
  difficulty: Difficulty;
  input: CheckInput;
  result: CheckResult;
  rulesetId: string;
  rulesetVersion: number;
  createdAt: Date;
}

export type SceneJournalEntry =
  | { type: "note"; value: SceneNote }
  | { type: "roll"; value: DiceRoll };
