import { z } from "zod";
import { worldEntityTypes } from "@/domain/world-entity";
import { sceneWorldSuggestionStatuses } from "@/domain/scene-world-suggestion";

export const sceneWorldSuggestionDraftSchema = z.object({
  type: z.enum(worldEntityTypes),
  name: z.string().trim().min(1).max(100),
  summary: z.string().trim().min(1).max(500),
});

export const sceneWorldSuggestionStatusSchema = z.enum(
  sceneWorldSuggestionStatuses,
);

export const sceneWorldSuggestionIdSchema = z.string().trim().min(1).max(100);
