import type { OracleRecord, YesNoOracleInput, YesNoOracleResult } from "@/oracle/types";
import type { PrismaClient } from "@/generated/prisma/client";
import type { OracleRepository } from "@/repositories/oracle-repository";
import { oracleAnswerSchema, oracleLikelihoodSchema } from "@/schemas/oracle";

type OracleRow = Awaited<ReturnType<PrismaClient["oracleRecord"]["findUnique"]>>;

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
}
