import type { Campaign, CampaignDraft } from "@/domain/campaign";
import type { CampaignRepository } from "@/repositories/campaign-repository";
import {
  campaignDraftSchema,
  campaignIdSchema,
} from "@/schemas/campaign";

export class CampaignNotFoundError extends Error {
  public constructor() {
    super("Campaign not found.");
    this.name = "CampaignNotFoundError";
  }
}

export class CampaignService {
  public constructor(
    private readonly repository: CampaignRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  public async create(input: unknown): Promise<Campaign> {
    return this.repository.create(this.parseDraft(input));
  }

  public async findById(id: string): Promise<Campaign | null> {
    return this.repository.findById(campaignIdSchema.parse(id));
  }

  public async list(includeArchived = false): Promise<Campaign[]> {
    return this.repository.list({ includeArchived });
  }

  public async update(
    id: string,
    input: unknown,
  ): Promise<Campaign> {
    const campaign = await this.repository.update(
      campaignIdSchema.parse(id),
      this.parseDraft(input),
    );

    if (!campaign) {
      throw new CampaignNotFoundError();
    }

    return campaign;
  }

  public async archive(id: string): Promise<Campaign> {
    const campaign = await this.repository.archive(
      campaignIdSchema.parse(id),
      this.now(),
    );

    if (!campaign) {
      throw new CampaignNotFoundError();
    }

    return campaign;
  }

  private parseDraft(input: unknown): CampaignDraft {
    return campaignDraftSchema.parse(input);
  }
}
