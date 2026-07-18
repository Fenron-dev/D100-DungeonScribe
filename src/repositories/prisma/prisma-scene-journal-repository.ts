import { z } from "zod";
import type { Character } from "@/domain/character";
import type {
  DiceRoll,
  SceneJournalEntry,
  SceneNote,
  SceneNoteDraft,
} from "@/domain/scene-journal";
import type { PrismaClient } from "@/generated/prisma/client";
import type {
  PersistedRollDraft,
  SceneJournalRepository,
} from "@/repositories/scene-journal-repository";
import { checkInputSchema, checkResultSchema } from "@/rules/rule-engine";
import { sceneNoteDraftSchema } from "@/schemas/scene-journal";
import { difficultySchema } from "@/schemas/rules";

type NoteRow = Awaited<ReturnType<PrismaClient["sceneNote"]["findUnique"]>>;
type RollRow = Awaited<ReturnType<PrismaClient["diceRoll"]["findUnique"]>>;

const participantIdsSchema = z.array(z.string());

function mapNote(row: NonNullable<NoteRow>): SceneNote {
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    ...sceneNoteDraftSchema.parse({ kind: row.kind, content: row.content }),
    createdAt: row.createdAt,
  };
}

function mapRoll(row: NonNullable<RollRow>): DiceRoll {
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    characterId: row.characterId,
    action: row.action,
    difficulty: difficultySchema.parse(row.difficulty),
    input: checkInputSchema.parse(row.input),
    result: checkResultSchema.parse(row.result),
    rulesetId: row.rulesetId,
    rulesetVersion: row.rulesetVersion,
    createdAt: row.createdAt,
  };
}

export class PrismaSceneJournalRepository implements SceneJournalRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async findRollCharacter(
    campaignId: string,
    sceneId: string,
    characterId: string,
  ): Promise<Character | null> {
    const [scene, character] = await Promise.all([
      this.client.scene.findFirst({
        where: { id: sceneId, campaignId, status: "active" },
      }),
      this.client.character.findFirst({ where: { id: characterId, campaignId } }),
    ]);
    if (!scene || !character) return null;
    const participantIds = participantIdsSchema.parse(scene.participantCharacterIds);
    if (!participantIds.includes(characterId)) return null;
    return {
      ...character,
      archetype: z.enum(["powerful", "agile", "insightful"]).parse(character.archetype),
      traits: participantIdsSchema.parse(character.traits),
    };
  }

  public async addNote(
    campaignId: string,
    sceneId: string,
    draft: SceneNoteDraft,
  ): Promise<SceneNote | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      select: { id: true },
    });
    if (!scene) return null;
    return this.client.$transaction(async (transaction) => {
      const note = await transaction.sceneNote.create({
        data: { campaignId, sceneId, ...draft },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_NOTE_ADDED",
          summary: draft.kind === "action" ? "Handlung festgehalten" : "Beobachtung festgehalten",
          payload: { sceneId, noteId: note.id, kind: draft.kind },
          source: "player",
          reversible: false,
        },
      });
      return mapNote(note);
    });
  }

  public async addRoll(
    campaignId: string,
    sceneId: string,
    draft: PersistedRollDraft,
  ): Promise<DiceRoll | null> {
    const character = await this.findRollCharacter(
      campaignId,
      sceneId,
      draft.input.characterId,
    );
    if (!character) return null;
    return this.client.$transaction(async (transaction) => {
      const roll = await transaction.diceRoll.create({
        data: {
          campaignId,
          sceneId,
          characterId: draft.input.characterId,
          action: draft.input.action,
          difficulty: draft.input.difficulty,
          input: draft.input,
          result: draft.result,
          rulesetId: draft.rulesetId,
          rulesetVersion: draft.rulesetVersion,
        },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "DICE_ROLLED",
          summary: "Probe ausgewertet",
          payload: {
            sceneId,
            rollId: roll.id,
            characterId: roll.characterId,
            degree: draft.result.degree,
          },
          source: "rule_engine",
          reversible: false,
        },
      });
      return mapRoll(roll);
    });
  }

  public async list(
    campaignId: string,
    sceneId: string,
  ): Promise<SceneJournalEntry[]> {
    const [notes, rolls] = await Promise.all([
      this.client.sceneNote.findMany({ where: { campaignId, sceneId } }),
      this.client.diceRoll.findMany({ where: { campaignId, sceneId } }),
    ]);
    return [
      ...notes.map((row) => ({ type: "note" as const, value: mapNote(row) })),
      ...rolls.map((row) => ({ type: "roll" as const, value: mapRoll(row) })),
    ].sort((left, right) => left.value.createdAt.getTime() - right.value.createdAt.getTime());
  }
}
