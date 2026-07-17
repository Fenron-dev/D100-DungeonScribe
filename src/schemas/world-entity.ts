import { z } from "zod";
import {
  worldEntityRelationStatuses,
  worldEntityRelationTypes,
  worldEntityStatuses,
  worldEntityTypes,
} from "@/domain/world-entity";

const optionalDescription = z
  .string()
  .trim()
  .max(4_000, "Die Beschreibung darf höchstens 4.000 Zeichen enthalten.")
  .transform((value) => (value.length > 0 ? value : null))
  .nullable();

export const worldEntityTagsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Tags dürfen nicht leer sein.")
      .max(40, "Ein Tag darf höchstens 40 Zeichen enthalten."),
  )
  .max(8, "Ein Weltobjekt darf höchstens acht Tags besitzen.")
  .refine((tags) => new Set(tags.map((tag) => tag.toLocaleLowerCase())).size === tags.length, {
    message: "Tags dürfen nicht doppelt vorkommen.",
  });

const optionalDetail = z
  .string()
  .trim()
  .max(200, "Eine Detailangabe darf höchstens 200 Zeichen enthalten.")
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .default(null);

export const worldEntityDetailsSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("npc"), role: optionalDetail, motivation: optionalDetail }),
  z.object({
    type: z.literal("location"),
    region: optionalDetail,
    atmosphere: optionalDetail,
  }),
  z.object({ type: z.literal("faction"), goal: optionalDetail, influence: optionalDetail }),
  z.object({ type: z.literal("item"), purpose: optionalDetail, rarity: optionalDetail }),
]);

export const worldEntityDraftSchema = z.object({
  type: z.enum(worldEntityTypes),
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Namen ein.")
    .max(120, "Der Name darf höchstens 120 Zeichen enthalten."),
  summary: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Kurzfassung ein.")
    .max(300, "Die Kurzfassung darf höchstens 300 Zeichen enthalten."),
  description: optionalDescription,
  tags: worldEntityTagsSchema,
  status: z.enum(worldEntityStatuses),
  details: worldEntityDetailsSchema,
}).superRefine((entity, context) => {
  if (entity.type !== entity.details.type) {
    context.addIssue({
      code: "custom",
      path: ["details"],
      message: "Die typspezifischen Angaben passen nicht zum Weltobjekttyp.",
    });
  }
});

export const worldEntityIdSchema = z
  .string()
  .trim()
  .min(1, "Weltobjekt-ID fehlt.")
  .max(64, "Weltobjekt-ID ist ungültig.");

export const worldEntityFilterSchema = z.object({
  query: z.string().trim().max(120).optional(),
  type: z.enum(worldEntityTypes).optional(),
});

export const worldEntityRelationDraftSchema = z.object({
  targetEntityId: worldEntityIdSchema,
  type: z.enum(worldEntityRelationTypes),
  description: z
    .string()
    .trim()
    .max(500, "Die Beziehungsbeschreibung darf höchstens 500 Zeichen enthalten.")
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
  status: z.enum(worldEntityRelationStatuses),
});

export const worldEntityRelationIdSchema = z
  .string()
  .trim()
  .min(1, "Beziehungs-ID fehlt.")
  .max(64, "Beziehungs-ID ist ungültig.");
