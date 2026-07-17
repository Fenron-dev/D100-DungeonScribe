export const knowledgeTypes = [
  "fact",
  "character_knowledge",
  "rumor",
  "secret",
  "assumption",
  "memory",
] as const;

export type KnowledgeType = (typeof knowledgeTypes)[number];

export const knowledgeTruthStatuses = [
  "true",
  "false",
  "partially_true",
  "unknown",
] as const;

export type KnowledgeTruthStatus = (typeof knowledgeTruthStatuses)[number];

export interface KnowledgeEntryDraft {
  title: string;
  content: string;
  type: KnowledgeType;
  truthStatus: KnowledgeTruthStatus;
  knownByCharacterIds: string[];
  relatedEntityIds: string[];
  locked: boolean;
}

export interface KnowledgeEntry extends KnowledgeEntryDraft {
  id: string;
  campaignId: string;
  sourceEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
