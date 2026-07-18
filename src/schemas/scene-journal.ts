import { z } from "zod";
import { sceneNoteKinds } from "@/domain/scene-journal";
import { difficulties } from "@/rules/types";
import { characterIdSchema } from "@/schemas/character";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `Der Eintrag darf höchstens ${maximum} Zeichen enthalten.`)
    .transform((value) => (value.length > 0 ? value : null))
    .nullable();

export const sceneNoteDraftSchema = z.object({
  kind: z.enum(sceneNoteKinds),
  content: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Eintrag ein.")
    .max(4_000, "Der Eintrag darf höchstens 4.000 Zeichen enthalten."),
});

export const diceRollDraftSchema = z.object({
  characterId: characterIdSchema,
  action: z
    .string()
    .trim()
    .min(1, "Bitte beschreibe die beabsichtigte Handlung.")
    .max(500, "Die Handlung darf höchstens 500 Zeichen enthalten."),
  difficulty: z.enum(difficulties),
  archetypeMatches: z.boolean(),
  matchingTrait: optionalText(120),
  advantage: optionalText(120),
  disadvantage: optionalText(120),
});
