import { z } from "zod";
import {
  sceneStateSuggestionKinds,
  sceneStateSuggestionStatuses,
} from "@/domain/scene-state-suggestion";
import { knowledgeEntryDraftSchema } from "@/schemas/knowledge-entry";
import { storyThreadDraftSchema } from "@/schemas/story-thread";

export const sceneStateSuggestionDraftSchema = z.object({
  kind: z.enum(sceneStateSuggestionKinds),
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(800),
});

export const sceneStateSuggestionStatusSchema = z.enum(
  sceneStateSuggestionStatuses,
);
export const sceneStateSuggestionIdSchema = z.string().trim().min(1).max(100);

export const sceneStateSuggestionResolutionSchema = z.discriminatedUnion(
  "kind",
  [
    z.object({
      kind: z.literal("knowledge"),
      draft: knowledgeEntryDraftSchema,
    }),
    z.object({
      kind: z.literal("thread"),
      draft: storyThreadDraftSchema,
    }),
  ],
);

export type SceneStateSuggestionResolution = z.infer<
  typeof sceneStateSuggestionResolutionSchema
>;
