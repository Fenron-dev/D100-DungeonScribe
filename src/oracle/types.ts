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

export const inspirationCategories = [
  "action",
  "theme",
  "mood",
  "person",
  "item",
  "location",
  "danger",
  "discovery",
  "complication",
] as const;

export type InspirationCategory = (typeof inspirationCategories)[number];

export const inspirationTables = {
  action: ["action.reveal", "action.protect", "action.transform", "action.pursue", "action.betray"],
  theme: ["theme.debt", "theme.freedom", "theme.loss", "theme.legacy", "theme.trust"],
  mood: ["mood.uneasy", "mood.hopeful", "mood.solemn", "mood.urgent", "mood.mysterious"],
  person: ["person.stranger", "person.rival", "person.witness", "person.guide", "person.outcast"],
  item: ["item.key", "item.letter", "item.relic", "item.map", "item.tool"],
  location: ["location.threshold", "location.ruin", "location.refuge", "location.crossroads", "location.depths"],
  danger: ["danger.ambush", "danger.collapse", "danger.deception", "danger.pursuit", "danger.exposure"],
  discovery: ["discovery.trace", "discovery.secret", "discovery.connection", "discovery.opportunity", "discovery.warning"],
  complication: ["complication.delay", "complication.price", "complication.mistake", "complication.attention", "complication.shortage"],
} as const satisfies Record<InspirationCategory, readonly string[]>;
export type InspirationTermId =
  (typeof inspirationTables)[InspirationCategory][number];

export const inspirationTermIds = [
  ...inspirationTables.action,
  ...inspirationTables.theme,
  ...inspirationTables.mood,
  ...inspirationTables.person,
  ...inspirationTables.item,
  ...inspirationTables.location,
  ...inspirationTables.danger,
  ...inspirationTables.discovery,
  ...inspirationTables.complication,
] as const;

export interface InspirationInput {
  question: string | null;
  primaryCategory: InspirationCategory;
  secondaryCategory: InspirationCategory;
}

export interface InspirationResult {
  primaryTermId: InspirationTermId;
  secondaryTermId: InspirationTermId;
  explanation: {
    primaryCategory: InspirationCategory;
    primaryIndex: number;
    primaryTableSize: number;
    secondaryCategory: InspirationCategory;
    secondaryIndex: number;
    secondaryTableSize: number;
  };
}

export interface OracleInspiration extends InspirationInput, InspirationResult {
  id: string;
  campaignId: string;
  sceneId: string;
  createdAt: Date;
}
