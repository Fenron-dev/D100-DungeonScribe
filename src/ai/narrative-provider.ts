import { z } from "zod";

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
    }),
    scene: z.object({
      title: z.string(),
      actualSetup: z.string(),
      objective: z.string().nullable(),
      participants: z.array(z.string()),
      activeThreads: z.array(z.string()),
    }),
  }),
});

export const narrationResultSchema = z.object({
  narration: z.string().trim().min(1).max(8_000),
});

export type NarrationRequest = z.infer<typeof narrationRequestSchema>;
export type NarrationResult = z.infer<typeof narrationResultSchema>;

export interface NarrativeProvider {
  generateNarration(request: NarrationRequest): Promise<NarrationResult>;
}
