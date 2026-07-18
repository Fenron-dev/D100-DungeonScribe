import { z } from "zod";
import { campaignStatuses } from "@/domain/campaign";
import {
  campaignTemplateIds,
  defaultCampaignStyle,
} from "@/domain/campaign-style";
import {
  campaignTensionMaximum,
  campaignTensionMinimum,
} from "@/oracle/tension";

const optionalShortText = z
  .string()
  .trim()
  .max(60, "Darf höchstens 60 Zeichen enthalten.")
  .transform((value) => (value.length > 0 ? value : null))
  .nullable();

const optionalLongText = z
  .string()
  .trim()
  .max(3_000, "Darf höchstens 3.000 Zeichen enthalten.")
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .default(null);

const styleValueSchema = z.number().int().min(1).max(5);

export const campaignStyleSchema = z.object({
  seriousness: styleValueSchema.default(defaultCampaignStyle.seriousness),
  groundedness: styleValueSchema.default(defaultCampaignStyle.groundedness),
  action: styleValueSchema.default(defaultCampaignStyle.action),
  combat: styleValueSchema.default(defaultCampaignStyle.combat),
  sliceOfLife: styleValueSchema.default(defaultCampaignStyle.sliceOfLife),
  rulesDensity: styleValueSchema.default(defaultCampaignStyle.rulesDensity),
  danger: styleValueSchema.default(defaultCampaignStyle.danger),
  lootAmount: styleValueSchema.default(defaultCampaignStyle.lootAmount),
  lootSignificance: styleValueSchema.default(
    defaultCampaignStyle.lootSignificance,
  ),
});

export const campaignTemplateIdSchema = z.enum(campaignTemplateIds);

export const campaignDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Namen ein.")
    .max(100, "Der Name darf höchstens 100 Zeichen enthalten."),
  premise: z
    .string()
    .trim()
    .min(1, "Bitte beschreibe die Kampagnenidee.")
    .max(2_000, "Die Kampagnenidee darf höchstens 2.000 Zeichen enthalten."),
  genre: optionalShortText,
  mood: optionalShortText,
  templateId: campaignTemplateIdSchema.default("balanced"),
  futureIdeas: optionalLongText,
  style: campaignStyleSchema.default(defaultCampaignStyle),
});

export const campaignIdSchema = z
  .string()
  .trim()
  .min(1, "Kampagnen-ID fehlt.")
  .max(64, "Kampagnen-ID ist ungültig.");

export const campaignStatusSchema = z.enum(campaignStatuses);

export const campaignTensionSchema = z
  .number()
  .int()
  .min(campaignTensionMinimum)
  .max(campaignTensionMaximum);

export type CampaignDraftInput = z.input<typeof campaignDraftSchema>;
