import { z } from "zod";
import { campaignStyleSchema } from "@/schemas/campaign";
import { sceneWorldSuggestionDraftSchema } from "@/schemas/scene-world-suggestion";
import { sceneStateSuggestionDraftSchema } from "@/schemas/scene-state-suggestion";

export const narrationRequestSchema = z.object({
  locale: z.enum(["de", "en"]),
  direction: z.string().trim().min(1).max(2_000),
  context: z.object({
    campaign: z.object({
      name: z.string(),
      premise: z.string(),
      genre: z.string().nullable(),
      mood: z.string().nullable(),
      tension: z.number().int().min(1).max(6),
      futureIdeas: z.string().nullable(),
      style: campaignStyleSchema,
    }),
    scene: z.object({
      title: z.string(),
      actualSetup: z.string(),
      objective: z.string().nullable(),
      participants: z.array(z.string()),
      activeThreads: z.array(z.string()),
      recentMessages: z.array(z.object({
        role: z.enum(["player", "narrator"]),
        content: z.string().min(1).max(8_000),
      })).max(20),
    }),
  }),
});

export const narrationResultSchema = z.object({
  narration: z.string().trim().min(1).max(8_000),
  worldSuggestions: z.array(sceneWorldSuggestionDraftSchema).max(3),
  stateSuggestions: z.array(sceneStateSuggestionDraftSchema).max(3),
});

export type NarrationRequest = z.infer<typeof narrationRequestSchema>;
export type NarrationResult = z.infer<typeof narrationResultSchema>;

export type NarrativeFailureReason =
  | "rate_limit"
  | "credits"
  | "model_unavailable"
  | "model_incompatible"
  | "provider_error";

export class NarrativeProviderError extends Error {
  public constructor(
    message: string,
    public readonly reason: NarrativeFailureReason = "provider_error",
  ) {
    super(message);
    this.name = "NarrativeProviderError";
  }
}

export interface NarrativeProvider {
  generateNarration(request: NarrationRequest): Promise<NarrationResult>;
}
