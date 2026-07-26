import type {
  CampaignStylePreset,
  CampaignStylePresetDraft,
} from "@/domain/campaign-style-preset";

export interface CampaignStylePresetRepository {
  create(draft: CampaignStylePresetDraft): Promise<CampaignStylePreset>;
  list(): Promise<CampaignStylePreset[]>;
  remove(id: string): Promise<boolean>;
}
