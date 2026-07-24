import type { LibraryWorldEntity } from "@/domain/library-world-entity";
import type { WorldEntity, WorldEntityDraft } from "@/domain/world-entity";
import type { CampaignRepository } from "@/repositories/campaign-repository";
import type { LibraryWorldEntityRepository } from "@/repositories/library-world-entity-repository";
import type { WorldEntityRepository } from "@/repositories/world-entity-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { libraryWorldEntityIdSchema } from "@/schemas/library-world-entity";
import { worldEntityIdSchema } from "@/schemas/world-entity";

export class LibrarySourceNotFoundError extends Error {
  public constructor() {
    super("The source world entity was not found.");
    this.name = "LibrarySourceNotFoundError";
  }
}

export class LibraryEntryNotFoundError extends Error {
  public constructor() {
    super("The library entry was not found.");
    this.name = "LibraryEntryNotFoundError";
  }
}

export class LibraryTargetCampaignError extends Error {
  public constructor() {
    super("The target campaign is missing or archived.");
    this.name = "LibraryTargetCampaignError";
  }
}

function toDraft(entity: WorldEntity): WorldEntityDraft {
  return {
    type: entity.type,
    name: entity.name,
    summary: entity.summary,
    description: entity.description,
    tags: entity.tags,
    status: entity.status,
    details: entity.details,
  };
}

export class LibraryWorldEntityService {
  public constructor(
    private readonly libraryRepository: LibraryWorldEntityRepository,
    private readonly worldEntityRepository: WorldEntityRepository,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async saveFromCampaign(
    campaignId: string,
    entityId: string,
  ): Promise<LibraryWorldEntity> {
    const validCampaignId = campaignIdSchema.parse(campaignId);
    const validEntityId = worldEntityIdSchema.parse(entityId);
    const entity = await this.worldEntityRepository.findById(
      validCampaignId,
      validEntityId,
    );
    if (!entity) throw new LibrarySourceNotFoundError();
    return this.libraryRepository.save(validEntityId, toDraft(entity));
  }

  public async list(): Promise<LibraryWorldEntity[]> {
    return this.libraryRepository.list();
  }

  public async listSavedSourceIds(entityIds: string[]): Promise<string[]> {
    const validIds = entityIds.map((id) => worldEntityIdSchema.parse(id));
    return this.libraryRepository.listSourceEntityIds(validIds);
  }

  public async removeBySourceEntityId(entityId: string): Promise<void> {
    const removed = await this.libraryRepository.removeBySourceEntityId(
      worldEntityIdSchema.parse(entityId),
    );
    if (!removed) throw new LibraryEntryNotFoundError();
  }

  public async copyToCampaign(
    libraryEntryId: string,
    targetCampaignId: string,
  ): Promise<void> {
    const validEntryId = libraryWorldEntityIdSchema.parse(libraryEntryId);
    const validCampaignId = campaignIdSchema.parse(targetCampaignId);
    const [entry, campaign] = await Promise.all([
      this.libraryRepository.findById(validEntryId),
      this.campaignRepository.findById(validCampaignId),
    ]);
    if (!entry) throw new LibraryEntryNotFoundError();
    if (!campaign || campaign.status !== "active") {
      throw new LibraryTargetCampaignError();
    }
    const created = await this.worldEntityRepository.create(
      validCampaignId,
      entry.draft,
    );
    if (!created) throw new LibraryTargetCampaignError();
  }
}
