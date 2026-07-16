import { z } from "zod";
import { characterArchetypes } from "@/domain/character";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `Darf höchstens ${maximum} Zeichen enthalten.`)
    .transform((value) => (value.length > 0 ? value : null))
    .nullable();

export const characterTraitsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Eigenschaften dürfen nicht leer sein.")
      .max(60, "Eine Eigenschaft darf höchstens 60 Zeichen enthalten."),
  )
  .min(1, "Bitte gib mindestens eine Eigenschaft ein.")
  .max(3, "Ein Charakter darf höchstens drei Eigenschaften besitzen.")
  .refine((traits) => new Set(traits).size === traits.length, {
    message: "Eigenschaften dürfen nicht doppelt vorkommen.",
  });

export const characterDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Namen ein.")
    .max(100, "Der Name darf höchstens 100 Zeichen enthalten."),
  concept: z
    .string()
    .trim()
    .min(1, "Bitte beschreibe das Charakterkonzept.")
    .max(500, "Das Konzept darf höchstens 500 Zeichen enthalten."),
  archetype: z.enum(characterArchetypes),
  traits: characterTraitsSchema,
  flaw: optionalText(120),
  notes: z.string().trim().max(4_000, "Notizen dürfen höchstens 4.000 Zeichen enthalten."),
});

export const characterIdSchema = z
  .string()
  .trim()
  .min(1, "Charakter-ID fehlt.")
  .max(64, "Charakter-ID ist ungültig.");
