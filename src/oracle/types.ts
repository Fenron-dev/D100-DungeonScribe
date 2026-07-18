export const oracleLikelihoods = [
  "nearly_impossible",
  "unlikely",
  "even",
  "likely",
  "nearly_certain",
] as const;

export type OracleLikelihood = (typeof oracleLikelihoods)[number];

export const oracleAnswers = [
  "no_and",
  "no",
  "no_but",
  "uncertain",
  "yes_but",
  "yes",
  "yes_and",
] as const;

export type OracleAnswer = (typeof oracleAnswers)[number];

export interface YesNoOracleInput {
  question: string;
  likelihood: OracleLikelihood;
}

export interface YesNoOracleResult {
  dice: [number, number];
  rawTotal: number;
  modifier: number;
  adjustedTotal: number;
  answer: OracleAnswer;
  isDouble: boolean;
  explanation: {
    likelihood: OracleLikelihood;
    rawTotal: number;
    modifier: number;
    adjustedTotal: number;
    wasLimited: boolean;
    answer: OracleAnswer;
  };
}

export interface OracleRecord extends YesNoOracleInput, YesNoOracleResult {
  id: string;
  campaignId: string;
  sceneId: string;
  createdAt: Date;
}
