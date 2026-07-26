import type {
  CampaignStyle,
  CampaignTemplateId,
} from "@/domain/campaign-style";

export interface CampaignStylePresetDraft {
  name: string;
  description: string | null;
  baseTemplateId: CampaignTemplateId;
  style: CampaignStyle;
}

export interface CampaignStylePreset extends CampaignStylePresetDraft {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignStylePresetOption = Pick<
  CampaignStylePreset,
  "id" | "name" | "baseTemplateId" | "style"
>;
