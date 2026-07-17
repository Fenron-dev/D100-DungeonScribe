export const worldEntityTypes = ["npc", "location", "faction", "item"] as const;
export const worldEntityStatuses = [
  "active",
  "inactive",
  "destroyed",
  "unknown",
] as const;

export type WorldEntityType = (typeof worldEntityTypes)[number];
export type WorldEntityStatus = (typeof worldEntityStatuses)[number];

export interface WorldEntity {
  id: string;
  campaignId: string;
  type: WorldEntityType;
  name: string;
  summary: string;
  description: string | null;
  tags: string[];
  status: WorldEntityStatus;
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
}

export interface WorldEntityFilter {
  query?: string | undefined;
  type?: WorldEntityType | undefined;
}
