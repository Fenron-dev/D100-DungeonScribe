import type {
  InspirationInput,
  InspirationResult,
  OracleInspiration,
  OracleRandomEvent,
  OracleRecord,
  RandomEventInput,
  RandomEventResult,
  YesNoOracleInput,
  YesNoOracleResult,
} from "@/oracle/types";

export interface OracleRepository {
  create(
    campaignId: string,
    sceneId: string,
    input: YesNoOracleInput,
    result: YesNoOracleResult,
  ): Promise<OracleRecord | null>;
  createInspiration(
    campaignId: string,
    sceneId: string,
    input: InspirationInput,
    result: InspirationResult,
  ): Promise<OracleInspiration | null>;
  createRandomEvent(
    campaignId: string,
    sceneId: string,
    input: RandomEventInput,
    result: RandomEventResult,
  ): Promise<OracleRandomEvent | null>;
}
