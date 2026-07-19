import { z } from "zod";
import type { Character } from "@/domain/character";
import type {
  DiceRoll,
  SceneJournalEntry,
  SceneMessage,
  SceneMessageDraft,
  SceneNote,
  SceneNoteDraft,
} from "@/domain/scene-journal";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  mapOracleInspiration,
  mapOracleRandomEvent,
  mapOracleRecord,
} from "@/repositories/prisma/prisma-oracle-repository";
import type {
  PersistedRollDraft,
  SceneJournalRepository,
} from "@/repositories/scene-journal-repository";
import { checkInputSchema, checkResultSchema } from "@/rules/rule-engine";
import {
  sceneMessageDraftSchema,
  sceneMessageSourceSchema,
  sceneNoteDraftSchema,
} from "@/schemas/scene-journal";
import { difficultySchema } from "@/schemas/rules";

type NoteRow = Awaited<ReturnType<PrismaClient["sceneNote"]["findUnique"]>>;
type MessageRow = Awaited<ReturnType<PrismaClient["sceneMessage"]["findUnique"]>>;
type MessageWithRevisions = Prisma.SceneMessageGetPayload<{ include: { revisions: true } }>;
type RollRow = Awaited<ReturnType<PrismaClient["diceRoll"]["findUnique"]>>;

const participantIdsSchema = z.array(z.string());

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function mapNote(row: NonNullable<NoteRow>): SceneNote {
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    ...sceneNoteDraftSchema.parse({ kind: row.kind, content: row.content }),
    createdAt: row.createdAt,
  };
}

function mapMessage(row: NonNullable<MessageRow> | MessageWithRevisions): SceneMessage {
  const revisions = "revisions" in row ? row.revisions : [];
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    ...sceneMessageDraftSchema.parse({ role: row.role, content: row.content }),
    source: sceneMessageSourceSchema.parse(row.source),
    versions: revisions
      .toSorted((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
      .map(({ id, content, createdAt }) => ({ id, content, createdAt })),
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

  public async addMessage(
    campaignId: string,
    sceneId: string,
    draft: SceneMessageDraft,
  ): Promise<SceneMessage | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      select: { id: true },
    });
    if (!scene) return null;
    return this.client.$transaction(async (transaction) => {
      const message = await transaction.sceneMessage.create({
        data: {
          campaignId,
          sceneId,
          ...draft,
          source: "manual",
          revisions: { create: { content: draft.content } },
        },
        include: { revisions: true },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_MESSAGE_ADDED",
          summary:
            draft.role === "player"
              ? "Spielerbeitrag festgehalten"
              : "Erzählbeitrag festgehalten",
          payload: { sceneId, messageId: message.id, role: draft.role },
          source: "manual",
          reversible: false,
        },
      });
      return mapMessage(message);
    });
  }

  public async updateNote(
    campaignId: string,
    sceneId: string,
    noteId: string,
    content: string,
  ): Promise<SceneNote | null> {
    const existing = await this.client.sceneNote.findFirst({
      where: { id: noteId, campaignId, sceneId },
      select: { id: true },
    });
    if (!existing) return null;
    return this.client.$transaction(async (transaction) => {
      const note = await transaction.sceneNote.update({
        where: { id: noteId },
        data: { content },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_NOTE_UPDATED",
          summary: "Journaleintrag angepasst",
          payload: { sceneId, noteId, fields: ["content"] },
          source: "manual",
          reversible: false,
        },
      });
      return mapNote(note);
    });
  }

  public async updateMessage(
    campaignId: string,
    sceneId: string,
    messageId: string,
    content: string,
  ): Promise<SceneMessage | null> {
    const existing = await this.client.sceneMessage.findFirst({
      where: { id: messageId, campaignId, sceneId },
      select: { id: true, role: true, content: true },
    });
    if (!existing) return null;
    return this.client.$transaction(async (transaction) => {
      const revisionContents = new Set(
        (await transaction.sceneMessageRevision.findMany({
          where: { messageId },
          select: { content: true },
        })).map(({ content: value }) => value),
      );
      for (const value of [existing.content, content]) {
        if (!revisionContents.has(value)) {
          await transaction.sceneMessageRevision.create({ data: { messageId, content: value } });
          revisionContents.add(value);
        }
      }
      const message = await transaction.sceneMessage.update({
        where: { id: messageId },
        data: { content },
        include: { revisions: true },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_MESSAGE_UPDATED",
          summary: existing.role === "narrator"
            ? "Erzähltext angepasst"
            : "Spielerbeitrag angepasst",
          payload: { sceneId, messageId, fields: ["content"] },
          source: "manual",
          reversible: false,
        },
      });
      return mapMessage(message);
    });
  }

  public async selectMessageVersion(
    campaignId: string,
    sceneId: string,
    messageId: string,
    versionId: string,
  ): Promise<SceneMessage | null> {
    const version = await this.client.sceneMessageRevision.findFirst({
      where: {
        id: versionId,
        message: { id: messageId, campaignId, sceneId, source: "ai" },
      },
    });
    if (!version) return null;
    return this.client.$transaction(async (transaction) => {
      const message = await transaction.sceneMessage.update({
        where: { id: messageId },
        data: { content: version.content },
        include: { revisions: true },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_MESSAGE_VERSION_SELECTED",
          summary: "Erzählvariante ausgewählt",
          payload: { sceneId, messageId, versionId },
          source: "player",
          reversible: false,
        },
      });
      return mapMessage(message);
    });
  }

  public async deleteAiMessage(
    campaignId: string,
    sceneId: string,
    messageId: string,
  ): Promise<boolean> {
    const existing = await this.client.sceneMessage.findFirst({
      where: { id: messageId, campaignId, sceneId, source: "ai" },
      select: { id: true },
    });
    if (!existing) return false;
    await this.client.$transaction(async (transaction) => {
      await transaction.sceneMessage.delete({ where: { id: messageId } });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "SCENE_MESSAGE_DELETED",
          summary: "KI-Erzähltext gelöscht",
          payload: { sceneId, messageId },
          source: "player",
          reversible: false,
        },
      });
    });
    return true;
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
          input: toPrismaJson(draft.input),
          result: toPrismaJson(draft.result),
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
    const [notes, messages, oracleRecords, inspirations, randomEvents, rolls] = await Promise.all([
      this.client.sceneNote.findMany({ where: { campaignId, sceneId } }),
      this.client.sceneMessage.findMany({
        where: { campaignId, sceneId },
        include: { revisions: true },
      }),
      this.client.oracleRecord.findMany({ where: { campaignId, sceneId } }),
      this.client.oracleInspiration.findMany({ where: { campaignId, sceneId } }),
      this.client.oracleRandomEvent.findMany({ where: { campaignId, sceneId } }),
      this.client.diceRoll.findMany({ where: { campaignId, sceneId } }),
    ]);
    return [
      ...notes.map((row) => ({ type: "note" as const, value: mapNote(row) })),
      ...messages.map((row) => ({ type: "message" as const, value: mapMessage(row) })),
      ...oracleRecords.map((row) => ({
        type: "oracle" as const,
        value: mapOracleRecord(row),
      })),
      ...inspirations.map((row) => ({
        type: "inspiration" as const,
        value: mapOracleInspiration(row),
      })),
      ...randomEvents.map((row) => ({
        type: "random_event" as const,
        value: mapOracleRandomEvent(row),
      })),
      ...rolls.map((row) => ({ type: "roll" as const, value: mapRoll(row) })),
    ].sort((left, right) => left.value.createdAt.getTime() - right.value.createdAt.getTime());
  }
}
