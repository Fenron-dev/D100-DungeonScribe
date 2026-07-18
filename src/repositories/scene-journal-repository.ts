import type {
  DiceRoll,
  SceneJournalEntry,
  SceneNote,
  SceneNoteDraft,
} from "@/domain/scene-journal";
import type { Character } from "@/domain/character";
import type { CheckInput, CheckResult } from "@/rules/types";

export interface PersistedRollDraft {
  input: CheckInput;
  result: CheckResult;
  rulesetId: string;
  rulesetVersion: number;
}

export interface SceneJournalRepository {
  findRollCharacter(
    campaignId: string,
    sceneId: string,
    characterId: string,
  ): Promise<Character | null>;
  addNote(
    campaignId: string,
    sceneId: string,
    draft: SceneNoteDraft,
  ): Promise<SceneNote | null>;
  addRoll(
    campaignId: string,
    sceneId: string,
    draft: PersistedRollDraft,
  ): Promise<DiceRoll | null>;
  list(campaignId: string, sceneId: string): Promise<SceneJournalEntry[]>;
}
