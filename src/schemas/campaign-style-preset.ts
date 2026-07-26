import { z } from "zod";
import {
  campaignStyleSchema,
  campaignTemplateIdSchema,
} from "@/schemas/campaign";

export const campaignStylePresetDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Namen ein.")
    .max(80, "Der Name darf höchstens 80 Zeichen enthalten."),
  description: z
    .string()
    .trim()
    .max(300, "Die Beschreibung darf höchstens 300 Zeichen enthalten.")
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
  baseTemplateId: campaignTemplateIdSchema,
  style: campaignStyleSchema,
});

export const campaignStylePresetIdSchema = z
  .string()
  .trim()
  .min(1, "Vorlagen-ID fehlt.")
  .max(64, "Vorlagen-ID ist ungültig.");
