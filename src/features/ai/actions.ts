"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { NarrativeFormState } from "@/features/ai/form-state";
import { getNarrativeService } from "@/services/narrative-service-instance";

const inputSchema = z.object({
  direction: z.string().trim().min(1).max(2_000),
});

export async function generateNarrationAction(
  campaignId: string,
  sceneId: string,
  _state: NarrativeFormState,
  formData: FormData,
): Promise<NarrativeFormState> {
  const rawDirection = formData.get("direction");
  const result = inputSchema.safeParse({
    direction: typeof rawDirection === "string" ? rawDirection : "",
  });
  if (!result.success) {
    return { message: "validation", errors: result.error.issues.map(({ message }) => message) };
  }
  try {
    const narration = await (await getNarrativeService()).narrate(
      campaignId,
      sceneId,
      result.data.direction,
    );
    if (!narration) return { message: "save_error", errors: [] };
  } catch (error) {
    const technicalError = error as { name?: unknown };
    const name = typeof technicalError.name === "string" ? technicalError.name : "UnknownError";
    console.error(`[ai] narration failed (${name})`);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}
