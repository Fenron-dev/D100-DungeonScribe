import type { LibraryWorldEntity } from "@/domain/library-world-entity";
import type { WorldEntityDraft } from "@/domain/world-entity";

export interface LibraryWorldEntityRepository {
  save(
    sourceEntityId: string,
    draft: WorldEntityDraft,
  ): Promise<LibraryWorldEntity>;
  findById(id: string): Promise<LibraryWorldEntity | null>;
  list(): Promise<LibraryWorldEntity[]>;
  listSourceEntityIds(sourceEntityIds: string[]): Promise<string[]>;
  removeBySourceEntityId(sourceEntityId: string): Promise<boolean>;
}
