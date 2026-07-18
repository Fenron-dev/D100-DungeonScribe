import { z } from "zod";
import type { CampaignDraft } from "@/domain/campaign";
import type { CharacterDraft } from "@/domain/character";
import type { WorldEntityDraft } from "@/domain/world-entity";
import type { SceneDraft } from "@/domain/scene";
import { campaignStyleSchema } from "@/schemas/campaign";

export const creativeDraftRequestSchema = z.object({
  locale: z.enum(["de", "en"]),
  preference: z.string().trim().max(500),
  variation: z.number().int().min(0).max(999_999),
  campaign: z.object({
    name: z.string(),
    premise: z.string(),
    genre: z.string().nullable(),
    mood: z.string().nullable(),
    templateId: z.enum(["balanced", "mythic", "dungeon", "cozy", "survival", "loot"]),
    futureIdeas: z.string().nullable(),
    style: campaignStyleSchema,
  }).nullable(),
});

export type CreativeDraftRequest = z.infer<typeof creativeDraftRequestSchema>;

export interface CreativeDraftProvider {
  generateCampaign(request: CreativeDraftRequest): Promise<CampaignDraft>;
  generateCharacter(request: CreativeDraftRequest): Promise<CharacterDraft>;
  generateWorldEntity(request: CreativeDraftRequest): Promise<WorldEntityDraft>;
  generateScene(request: CreativeDraftRequest): Promise<SceneDraft>;
}
