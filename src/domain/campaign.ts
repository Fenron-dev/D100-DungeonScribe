import type {
  CampaignStyle,
  CampaignTemplateId,
} from "@/domain/campaign-style";

export const campaignStatuses = ["active", "archived"] as const;

export type CampaignStatus = (typeof campaignStatuses)[number];

export interface Campaign {
  id: string;
  name: string;
  premise: string;
  genre: string | null;
  mood: string | null;
  templateId: CampaignTemplateId;
  futureIdeas: string | null;
  style: CampaignStyle;
  tension: number;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export interface CampaignDraft {
  name: string;
  premise: string;
  genre: string | null;
  mood: string | null;
  templateId: CampaignTemplateId;
  futureIdeas: string | null;
  style: CampaignStyle;
}
