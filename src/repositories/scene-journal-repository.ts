import type {
  DiceRoll,
  SceneJournalEntry,
  SceneMessage,
  SceneMessageDraft,
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
  addMessage(
    campaignId: string,
    sceneId: string,
    draft: SceneMessageDraft,
  ): Promise<SceneMessage | null>;
  updateNote(
    campaignId: string,
    sceneId: string,
    noteId: string,
    content: string,
  ): Promise<SceneNote | null>;
  updateMessage(
    campaignId: string,
    sceneId: string,
    messageId: string,
    content: string,
  ): Promise<SceneMessage | null>;
  selectMessageVersion(
    campaignId: string,
    sceneId: string,
    messageId: string,
    versionId: string,
  ): Promise<SceneMessage | null>;
  deleteAiMessage(
    campaignId: string,
    sceneId: string,
    messageId: string,
  ): Promise<boolean>;
  addRoll(
    campaignId: string,
    sceneId: string,
    draft: PersistedRollDraft,
  ): Promise<DiceRoll | null>;
  list(campaignId: string, sceneId: string): Promise<SceneJournalEntry[]>;
}
