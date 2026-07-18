import type {
  OracleRecord,
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
}
