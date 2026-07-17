import { z } from "zod";
import {
  knowledgeTruthStatuses,
  knowledgeTypes,
} from "@/domain/knowledge-entry";
import { characterIdSchema } from "@/schemas/character";
import { worldEntityIdSchema } from "@/schemas/world-entity";

const uniqueIds = <T extends z.ZodType<string>>(schema: T, maximum: number) =>
  z
    .array(schema)
    .max(maximum, `Es dürfen höchstens ${maximum} Einträge ausgewählt werden.`)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Einträge dürfen nicht doppelt ausgewählt werden.",
    });

export const knowledgeEntryDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Titel ein.")
    .max(160, "Der Titel darf höchstens 160 Zeichen enthalten."),
  content: z
    .string()
    .trim()
    .min(1, "Bitte beschreibe den Wissenseintrag.")
    .max(8_000, "Der Inhalt darf höchstens 8.000 Zeichen enthalten."),
  type: z.enum(knowledgeTypes),
  truthStatus: z.enum(knowledgeTruthStatuses),
  knownByCharacterIds: uniqueIds(characterIdSchema, 20),
  relatedEntityIds: uniqueIds(worldEntityIdSchema, 30),
  locked: z.boolean(),
});

export const knowledgeEntryIdSchema = z
  .string()
  .trim()
  .min(1, "Wissenseintrags-ID fehlt.")
  .max(64, "Wissenseintrags-ID ist ungültig.");
