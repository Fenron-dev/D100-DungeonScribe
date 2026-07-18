export const campaignEventTypes = [
  "CAMPAIGN_CREATED",
  "CAMPAIGN_UPDATED",
  "CAMPAIGN_ARCHIVED",
  "CHARACTER_CREATED",
  "CHARACTER_UPDATED",
  "ENTITY_CREATED",
  "ENTITY_UPDATED",
  "ENTITY_RELATION_CREATED",
  "ENTITY_RELATION_REMOVED",
  "KNOWLEDGE_DISCOVERED",
  "KNOWLEDGE_UPDATED",
  "THREAD_CREATED",
  "THREAD_UPDATED",
  "SCENE_STARTED",
  "SCENE_NOTE_ADDED",
  "SCENE_MESSAGE_ADDED",
  "DICE_ROLLED",
  "ORACLE_ANSWERED",
  "ORACLE_INSPIRATION_DRAWN",
  "ORACLE_RANDOM_EVENT_GENERATED",
  "TENSION_CHANGED",
  "SCENE_COMPLETED",
] as const;

export type CampaignEventType = (typeof campaignEventTypes)[number];

export const campaignEventSources = [
  "player",
  "rule_engine",
  "oracle",
  "ai",
  "manual",
] as const;

export type CampaignEventSource = (typeof campaignEventSources)[number];

export const campaignEventCategories = [
  "all",
  "campaign",
  "characters",
  "world",
  "knowledge",
  "threads",
  "scenes",
] as const;

export type CampaignEventCategory = (typeof campaignEventCategories)[number];

export interface CampaignEvent {
  id: string;
  campaignId: string;
  eventType: CampaignEventType;
  timestampReal: Date;
  summary: string;
  source: CampaignEventSource;
  reversible: boolean;
}

export function getCampaignEventCategory(
  eventType: CampaignEventType,
): Exclude<CampaignEventCategory, "all"> {
  if (eventType.startsWith("CAMPAIGN_")) return "campaign";
  if (eventType.startsWith("CHARACTER_")) return "characters";
  if (eventType.startsWith("ENTITY_")) return "world";
  if (eventType.startsWith("KNOWLEDGE_")) return "knowledge";
  if (eventType.startsWith("THREAD_")) return "threads";
  return "scenes";
}
