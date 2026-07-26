import type {
  CampaignStylePreset,
  CampaignStylePresetDraft,
} from "@/domain/campaign-style-preset";
import type { CampaignStylePresetRepository } from "@/repositories/campaign-style-preset-repository";
import {
  campaignStylePresetDraftSchema,
  campaignStylePresetIdSchema,
} from "@/schemas/campaign-style-preset";

export class CampaignStylePresetNotFoundError extends Error {
  public constructor() {
    super("The campaign style preset was not found.");
    this.name = "CampaignStylePresetNotFoundError";
  }
}

export class CampaignStylePresetService {
  public constructor(
    private readonly repository: CampaignStylePresetRepository,
  ) {}

  public async create(input: unknown): Promise<CampaignStylePreset> {
    const draft: CampaignStylePresetDraft =
      campaignStylePresetDraftSchema.parse(input);
    return this.repository.create(draft);
  }

  public async list(): Promise<CampaignStylePreset[]> {
    return this.repository.list();
  }

  public async remove(id: string): Promise<void> {
    const removed = await this.repository.remove(
      campaignStylePresetIdSchema.parse(id),
    );
    if (!removed) throw new CampaignStylePresetNotFoundError();
  }
}
