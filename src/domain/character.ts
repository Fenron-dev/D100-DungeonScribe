export const characterArchetypes = [
  "powerful",
  "agile",
  "insightful",
] as const;

export type CharacterArchetype = (typeof characterArchetypes)[number];

export interface Character {
  id: string;
  campaignId: string;
  name: string;
  concept: string;
  archetype: CharacterArchetype;
  traits: string[];
  flaw: string | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterDraft {
  name: string;
  concept: string;
  archetype: CharacterArchetype;
  traits: string[];
  flaw: string | null;
  notes: string;
}
