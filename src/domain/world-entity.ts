export const worldEntityTypes = ["npc", "location", "faction", "item"] as const;
export const worldEntityStatuses = [
  "active",
  "inactive",
  "destroyed",
  "unknown",
] as const;

export type WorldEntityType = (typeof worldEntityTypes)[number];
export type WorldEntityStatus = (typeof worldEntityStatuses)[number];

export type WorldEntityDetails =
  | { type: "npc"; role: string | null; motivation: string | null }
  | { type: "location"; region: string | null; atmosphere: string | null }
  | { type: "faction"; goal: string | null; influence: string | null }
  | { type: "item"; purpose: string | null; rarity: string | null };

export const worldEntityRelationTypes = [
  "located_at",
  "member_of",
  "owns",
  "allied_with",
  "hostile_to",
  "connected_to",
] as const;
export const worldEntityRelationStatuses = ["active", "inactive"] as const;

export type WorldEntityRelationType =
  (typeof worldEntityRelationTypes)[number];
export type WorldEntityRelationStatus =
  (typeof worldEntityRelationStatuses)[number];

export interface WorldEntity {
  id: string;
  campaignId: string;
  type: WorldEntityType;
  name: string;
  summary: string;
  description: string | null;
  tags: string[];
  status: WorldEntityStatus;
  details: WorldEntityDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorldEntityDraft {
  type: WorldEntityType;
  name: string;
  summary: string;
  description: string | null;
  tags: string[];
  status: WorldEntityStatus;
  details: WorldEntityDetails;
}

export interface WorldEntityRelation {
  id: string;
  campaignId: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: WorldEntityRelationType;
  description: string | null;
  status: WorldEntityRelationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorldEntityRelationDraft {
  targetEntityId: string;
  type: WorldEntityRelationType;
  description: string | null;
  status: WorldEntityRelationStatus;
}

export interface WorldEntityFilter {
  query?: string | undefined;
  type?: WorldEntityType | undefined;
}
