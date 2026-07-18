export const campaignTemplateIds = [
  "balanced",
  "mythic",
  "dungeon",
  "cozy",
  "survival",
  "loot",
] as const;

export type CampaignTemplateId = (typeof campaignTemplateIds)[number];

export interface CampaignStyle {
  seriousness: number;
  groundedness: number;
  action: number;
  combat: number;
  sliceOfLife: number;
  rulesDensity: number;
  danger: number;
  lootAmount: number;
  lootSignificance: number;
}

export const defaultCampaignStyle: CampaignStyle = {
  seriousness: 3,
  groundedness: 3,
  action: 3,
  combat: 3,
  sliceOfLife: 3,
  rulesDensity: 3,
  danger: 3,
  lootAmount: 3,
  lootSignificance: 3,
};

export const campaignStyleTemplates: Record<
  CampaignTemplateId,
  CampaignStyle
> = {
  balanced: defaultCampaignStyle,
  mythic: {
    seriousness: 5,
    groundedness: 4,
    action: 4,
    combat: 3,
    sliceOfLife: 2,
    rulesDensity: 3,
    danger: 4,
    lootAmount: 2,
    lootSignificance: 5,
  },
  dungeon: {
    seriousness: 2,
    groundedness: 1,
    action: 5,
    combat: 5,
    sliceOfLife: 1,
    rulesDensity: 4,
    danger: 5,
    lootAmount: 5,
    lootSignificance: 4,
  },
  cozy: {
    seriousness: 2,
    groundedness: 3,
    action: 1,
    combat: 1,
    sliceOfLife: 5,
    rulesDensity: 2,
    danger: 1,
    lootAmount: 3,
    lootSignificance: 3,
  },
  survival: {
    seriousness: 5,
    groundedness: 5,
    action: 4,
    combat: 4,
    sliceOfLife: 2,
    rulesDensity: 4,
    danger: 5,
    lootAmount: 1,
    lootSignificance: 5,
  },
  loot: {
    seriousness: 2,
    groundedness: 1,
    action: 5,
    combat: 5,
    sliceOfLife: 1,
    rulesDensity: 3,
    danger: 3,
    lootAmount: 5,
    lootSignificance: 3,
  },
};
