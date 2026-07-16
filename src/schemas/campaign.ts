import { z } from "zod";
import { campaignStatuses } from "@/domain/campaign";

const optionalShortText = z
  .string()
  .trim()
  .max(60, "Darf höchstens 60 Zeichen enthalten.")
  .transform((value) => (value.length > 0 ? value : null))
  .nullable();

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
});

export const campaignIdSchema = z
  .string()
  .trim()
  .min(1, "Kampagnen-ID fehlt.")
  .max(64, "Kampagnen-ID ist ungültig.");

export const campaignStatusSchema = z.enum(campaignStatuses);

export type CampaignDraftInput = z.input<typeof campaignDraftSchema>;
