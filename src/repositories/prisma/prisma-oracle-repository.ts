import {
  eventFocuses,
  inspirationTables,
  randomEventActionIds,
  randomEventSubjectIds,
  type InspirationInput,
  type InspirationResult,
  type InspirationTermId,
  type OracleInspiration,
  type OracleRandomEvent,
  type OracleRecord,
  type RandomEventInput,
  type RandomEventResult,
  type YesNoOracleInput,
  type YesNoOracleResult,
} from "@/oracle/types";
import type { PrismaClient } from "@/generated/prisma/client";
import type { OracleRepository } from "@/repositories/oracle-repository";
import {
  inspirationCategorySchema,
  inspirationTermIdSchema,
  eventFocusSchema,
  oracleAnswerSchema,
  oracleLikelihoodSchema,
  randomEventActionIdSchema,
  randomEventSubjectIdSchema,
  randomEventTriggerSchema,
} from "@/schemas/oracle";

type OracleRow = Awaited<ReturnType<PrismaClient["oracleRecord"]["findUnique"]>>;
type InspirationRow = Awaited<
  ReturnType<PrismaClient["oracleInspiration"]["findUnique"]>
>;
type RandomEventRow = Awaited<
  ReturnType<PrismaClient["oracleRandomEvent"]["findUnique"]>
>;

function parseTermId(value: string): InspirationTermId {
  return inspirationTermIdSchema.parse(value);
}

export function mapOracleRecord(row: NonNullable<OracleRow>): OracleRecord {
  const likelihood = oracleLikelihoodSchema.parse(row.likelihood);
  const answer = oracleAnswerSchema.parse(row.answer);
  const dice: [number, number] = [row.dieOne, row.dieTwo];
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    question: row.question,
    likelihood,
    dice,
    rawTotal: row.rawTotal,
    modifier: row.modifier,
    adjustedTotal: row.adjustedTotal,
    answer,
    isDouble: row.isDouble,
    explanation: {
      likelihood,
      rawTotal: row.rawTotal,
      modifier: row.modifier,
      adjustedTotal: row.adjustedTotal,
      wasLimited: row.rawTotal + row.modifier !== row.adjustedTotal,
      answer,
    },
    createdAt: row.createdAt,
  };
}

export function mapOracleInspiration(
  row: NonNullable<InspirationRow>,
): OracleInspiration {
  const primaryCategory = inspirationCategorySchema.parse(row.primaryCategory);
  const secondaryCategory = inspirationCategorySchema.parse(row.secondaryCategory);
  const primaryTermId = parseTermId(row.primaryTermId);
  const secondaryTermId = parseTermId(row.secondaryTermId);
  const primaryTable: readonly InspirationTermId[] = inspirationTables[primaryCategory];
  const secondaryTable: readonly InspirationTermId[] = inspirationTables[secondaryCategory];
  const primaryIndex = primaryTable.indexOf(primaryTermId);
  const secondaryIndex = secondaryTable.indexOf(secondaryTermId);
  if (primaryIndex < 0 || secondaryIndex < 0) {
    throw new Error("Persisted inspiration term does not match its category.");
  }
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    question: row.question,
    primaryCategory,
    primaryTermId,
    secondaryCategory,
    secondaryTermId,
    explanation: {
      primaryCategory,
      primaryIndex,
      primaryTableSize: primaryTable.length,
      secondaryCategory,
      secondaryIndex,
      secondaryTableSize: secondaryTable.length,
    },
    createdAt: row.createdAt,
  };
}

export function mapOracleRandomEvent(
  row: NonNullable<RandomEventRow>,
): OracleRandomEvent {
  const focus = eventFocusSchema.parse(row.focus);
  const actionId = randomEventActionIdSchema.parse(row.actionId);
  const subjectId = randomEventSubjectIdSchema.parse(row.subjectId);
  return {
    id: row.id,
    campaignId: row.campaignId,
    sceneId: row.sceneId,
    context: row.context,
    trigger: randomEventTriggerSchema.parse(row.trigger),
    focus,
    actionId,
    subjectId,
    affectedEntityId: row.affectedEntityId,
    explanation: {
      focusIndex: eventFocuses.indexOf(focus),
      focusTableSize: eventFocuses.length,
      actionIndex: randomEventActionIds.indexOf(actionId),
      actionTableSize: randomEventActionIds.length,
      subjectIndex: randomEventSubjectIds.indexOf(subjectId),
      subjectTableSize: randomEventSubjectIds.length,
    },
    createdAt: row.createdAt,
  };
}

export class PrismaOracleRepository implements OracleRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async create(
    campaignId: string,
    sceneId: string,
    input: YesNoOracleInput,
    result: YesNoOracleResult,
  ): Promise<OracleRecord | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      select: { id: true },
    });
    if (!scene) return null;
    return this.client.$transaction(async (transaction) => {
      const record = await transaction.oracleRecord.create({
        data: {
          campaignId,
          sceneId,
          question: input.question,
          likelihood: input.likelihood,
          dieOne: result.dice[0],
          dieTwo: result.dice[1],
          rawTotal: result.rawTotal,
          modifier: result.modifier,
          adjustedTotal: result.adjustedTotal,
          answer: result.answer,
          isDouble: result.isDouble,
        },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ORACLE_ANSWERED",
          summary: "Orakelfrage beantwortet",
          payload: {
            sceneId,
            oracleRecordId: record.id,
            answer: result.answer,
          },
          source: "oracle",
          reversible: false,
        },
      });
      return mapOracleRecord(record);
    });
  }

  public async createInspiration(
    campaignId: string,
    sceneId: string,
    input: InspirationInput,
    result: InspirationResult,
  ): Promise<OracleInspiration | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      select: { id: true },
    });
    if (!scene) return null;
    return this.client.$transaction(async (transaction) => {
      const inspiration = await transaction.oracleInspiration.create({
        data: {
          campaignId,
          sceneId,
          question: input.question,
          primaryCategory: input.primaryCategory,
          primaryTermId: result.primaryTermId,
          secondaryCategory: input.secondaryCategory,
          secondaryTermId: result.secondaryTermId,
        },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ORACLE_INSPIRATION_DRAWN",
          summary: "Orakelinspiration gezogen",
          payload: {
            sceneId,
            oracleInspirationId: inspiration.id,
            primaryTermId: result.primaryTermId,
            secondaryTermId: result.secondaryTermId,
          },
          source: "oracle",
          reversible: false,
        },
      });
      return mapOracleInspiration(inspiration);
    });
  }

  public async createRandomEvent(
    campaignId: string,
    sceneId: string,
    input: RandomEventInput,
    result: RandomEventResult,
  ): Promise<OracleRandomEvent | null> {
    const scene = await this.client.scene.findFirst({
      where: { id: sceneId, campaignId, status: "active" },
      select: { id: true },
    });
    if (!scene) return null;
    return this.client.$transaction(async (transaction) => {
      const randomEvent = await transaction.oracleRandomEvent.create({
        data: {
          campaignId,
          sceneId,
          context: input.context,
          trigger: input.trigger,
          focus: result.focus,
          actionId: result.actionId,
          subjectId: result.subjectId,
          affectedEntityId: result.affectedEntityId,
        },
      });
      await transaction.campaignEvent.create({
        data: {
          campaignId,
          eventType: "ORACLE_RANDOM_EVENT_GENERATED",
          summary: "Zufallsereignis erzeugt",
          payload: {
            sceneId,
            oracleRandomEventId: randomEvent.id,
            trigger: input.trigger,
            focus: result.focus,
          },
          source: "oracle",
          reversible: false,
        },
      });
      return mapOracleRandomEvent(randomEvent);
    });
  }
}
