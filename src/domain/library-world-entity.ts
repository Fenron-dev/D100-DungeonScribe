import type { WorldEntityDraft } from "@/domain/world-entity";

export interface LibraryWorldEntity {
  id: string;
  sourceEntityId: string;
  draft: WorldEntityDraft;
  createdAt: Date;
  updatedAt: Date;
}
