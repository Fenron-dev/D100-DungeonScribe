import { z } from "zod";
import {
  campaignEventCategories,
  campaignEventSources,
  campaignEventTypes,
} from "@/domain/campaign-event";

export const campaignEventTypeSchema = z.enum(campaignEventTypes);
export const campaignEventSourceSchema = z.enum(campaignEventSources);
export const campaignEventCategorySchema = z.enum(campaignEventCategories);
