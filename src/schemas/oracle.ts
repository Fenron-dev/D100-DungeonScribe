import { z } from "zod";
import {
  inspirationCategories,
  inspirationTermIds,
  eventFocuses,
  oracleAnswers,
  oracleLikelihoods,
  randomEventActionIds,
  randomEventSubjectIds,
  randomEventTriggers,
} from "@/oracle/types";

export const yesNoOracleInputSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Ja-Nein-Frage ein.")
    .max(500, "Die Frage darf höchstens 500 Zeichen enthalten."),
  likelihood: z.enum(oracleLikelihoods),
});

export const oracleLikelihoodSchema = z.enum(oracleLikelihoods);
export const oracleAnswerSchema = z.enum(oracleAnswers);

export const inspirationCategorySchema = z.enum(inspirationCategories);
export const inspirationTermIdSchema = z.enum(inspirationTermIds);

export const inspirationInputSchema = z.object({
  question: z
    .string()
    .trim()
    .max(500, "Die Detailfrage darf höchstens 500 Zeichen enthalten.")
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
  primaryCategory: inspirationCategorySchema,
  secondaryCategory: inspirationCategorySchema,
});

export const randomEventTriggerSchema = z.enum(randomEventTriggers);
export const eventFocusSchema = z.enum(eventFocuses);
export const randomEventActionIdSchema = z.enum(randomEventActionIds);
export const randomEventSubjectIdSchema = z.enum(randomEventSubjectIds);

export const randomEventInputSchema = z.object({
  context: z
    .string()
    .trim()
    .max(500, "Der Ereigniskontext darf höchstens 500 Zeichen enthalten.")
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
  trigger: randomEventTriggerSchema,
});
