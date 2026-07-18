import {
  creativeDraftRequestSchema,
  type CreativeDraftProvider,
  type CreativeDraftRequest,
} from "@/ai/creative-draft-provider";
import type { CampaignDraft } from "@/domain/campaign";
import type { CharacterDraft } from "@/domain/character";
import type { WorldEntityDraft } from "@/domain/world-entity";
import type { RandomSource } from "@/rules/random-source";

export class CreativeDraftService {
  public constructor(
    private readonly provider: CreativeDraftProvider,
    private readonly randomSource: RandomSource,
  ) {}

  private request(
    preference: string,
    campaign: CampaignDraft | null,
  ): CreativeDraftRequest {
    return creativeDraftRequestSchema.parse({
      locale: "de",
      preference,
      variation: this.randomSource.nextInt(0, 999_999),
      campaign,
    });
  }

  public generateCampaign(preference: string): Promise<CampaignDraft> {
    return this.provider.generateCampaign(this.request(preference, null));
  }

  public generateCharacter(
    preference: string,
    campaign: CampaignDraft,
  ): Promise<CharacterDraft> {
    return this.provider.generateCharacter(this.request(preference, campaign));
  }

  public generateWorldEntity(
    preference: string,
    campaign: CampaignDraft,
  ): Promise<WorldEntityDraft> {
    return this.provider.generateWorldEntity(this.request(preference, campaign));
  }
}
