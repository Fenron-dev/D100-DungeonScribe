import { z } from "zod";
import { storyThreadStatuses } from "@/domain/story-thread";
import { worldEntityIdSchema } from "@/schemas/world-entity";

export const storyThreadDraftSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Bitte gib einen Titel ein.")
      .max(160, "Der Titel darf höchstens 160 Zeichen enthalten."),
    premise: z
      .string()
      .trim()
      .min(1, "Bitte beschreibe die Ausgangslage.")
      .max(800, "Die Ausgangslage darf höchstens 800 Zeichen enthalten."),
    description: z
      .string()
      .trim()
      .max(4_000, "Die Beschreibung darf höchstens 4.000 Zeichen enthalten.")
      .transform((value) => (value.length > 0 ? value : null))
      .nullable(),
    status: z.enum(storyThreadStatuses),
    urgency: z.coerce
      .number()
      .int("Die Dringlichkeit muss eine ganze Zahl sein.")
      .min(1, "Die Dringlichkeit muss mindestens 1 betragen.")
      .max(5, "Die Dringlichkeit darf höchstens 5 betragen."),
    progressCurrent: z.coerce
      .number()
      .int("Der Fortschritt muss eine ganze Zahl sein.")
      .min(0, "Der Fortschritt darf nicht negativ sein.")
      .max(12, "Der Fortschritt darf höchstens 12 betragen."),
    progressTarget: z.coerce
      .number()
      .int("Das Fortschrittsziel muss eine ganze Zahl sein.")
      .min(1, "Das Fortschrittsziel muss mindestens 1 betragen.")
      .max(12, "Das Fortschrittsziel darf höchstens 12 betragen."),
    relatedEntityIds: z
      .array(worldEntityIdSchema)
      .max(30, "Es dürfen höchstens 30 Weltobjekte verknüpft werden.")
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "Weltobjekte dürfen nicht doppelt ausgewählt werden.",
      }),
    nextPossibleDevelopments: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Mögliche Entwicklungen dürfen nicht leer sein.")
          .max(240, "Eine Entwicklung darf höchstens 240 Zeichen enthalten."),
      )
      .max(5, "Es dürfen höchstens fünf mögliche Entwicklungen gespeichert werden.")
      .refine(
        (developments) => new Set(developments).size === developments.length,
        { message: "Mögliche Entwicklungen dürfen nicht doppelt vorkommen." },
      ),
  })
  .superRefine((thread, context) => {
    if (thread.progressCurrent > thread.progressTarget) {
      context.addIssue({
        code: "custom",
        path: ["progressCurrent"],
        message: "Der Fortschritt darf das Ziel nicht überschreiten.",
      });
    }
  });

export const storyThreadIdSchema = z
  .string()
  .trim()
  .min(1, "Handlungsstrang-ID fehlt.")
  .max(64, "Handlungsstrang-ID ist ungültig.");
