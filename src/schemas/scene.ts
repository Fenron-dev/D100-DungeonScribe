import { z } from "zod";
import { sceneStatuses } from "@/domain/scene";
import { tensionAdjustments } from "@/oracle/tension";
import { characterIdSchema } from "@/schemas/character";
import { storyThreadIdSchema } from "@/schemas/story-thread";
import { worldEntityIdSchema } from "@/schemas/world-entity";

const optionalId = (schema: z.ZodType<string>) =>
  z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : null))
    .nullable()
    .refine((value) => value === null || schema.safeParse(value).success, {
      message: "Die ausgewählte Referenz ist ungültig.",
    });

const uniqueIds = (schema: z.ZodType<string>, maximum: number) =>
  z
    .array(schema)
    .max(maximum, `Es dürfen höchstens ${maximum} Einträge ausgewählt werden.`)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Einträge dürfen nicht doppelt ausgewählt werden.",
    });

export const sceneDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Szenentitel ein.")
    .max(160, "Der Titel darf höchstens 160 Zeichen enthalten."),
  locationId: optionalId(worldEntityIdSchema),
  expectedSetup: z
    .string()
    .trim()
    .min(1, "Bitte beschreibe die erwartete Ausgangssituation.")
    .max(2_000, "Die erwartete Ausgangssituation darf höchstens 2.000 Zeichen enthalten."),
  actualSetup: z
    .string()
    .trim()
    .min(1, "Bitte beschreibe den tatsächlichen Szenenbeginn.")
    .max(2_000, "Der tatsächliche Szenenbeginn darf höchstens 2.000 Zeichen enthalten."),
  objective: z
    .string()
    .trim()
    .max(500, "Das Ziel darf höchstens 500 Zeichen enthalten.")
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
  participantCharacterIds: uniqueIds(characterIdSchema, 20),
  participantEntityIds: uniqueIds(worldEntityIdSchema, 30),
  relevantThreadIds: uniqueIds(storyThreadIdSchema, 20),
});

export const sceneStatusSchema = z.enum(sceneStatuses);

export const sceneSummarySchema = z
  .string()
  .trim()
  .min(1, "Bitte fasse den Szenenabschluss zusammen.")
  .max(8_000, "Die Zusammenfassung darf höchstens 8.000 Zeichen enthalten.");

export const tensionAdjustmentSchema = z.enum(tensionAdjustments);

export const sceneCompletionInputSchema = z.object({
  summary: sceneSummarySchema,
  tensionAdjustment: tensionAdjustmentSchema,
});

export const sceneIdSchema = z
  .string()
  .trim()
  .min(1, "Szenen-ID fehlt.")
  .max(64, "Szenen-ID ist ungültig.");
