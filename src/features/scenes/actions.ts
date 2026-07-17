"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  SceneCompletionState,
  SceneFormErrors,
  SceneFormState,
} from "@/features/scenes/form-state";
import { sceneDraftSchema, sceneSummarySchema } from "@/schemas/scene";
import { ActiveSceneExistsError } from "@/services/scene-service";
import { sceneService } from "@/services/scene-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readTextList(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeErrors(
  errors: Partial<Record<keyof SceneFormErrors, string[] | undefined>>,
): SceneFormErrors {
  return {
    title: errors.title ?? [],
    locationId: errors.locationId ?? [],
    expectedSetup: errors.expectedSetup ?? [],
    actualSetup: errors.actualSetup ?? [],
    objective: errors.objective ?? [],
    participantCharacterIds: errors.participantCharacterIds ?? [],
    participantEntityIds: errors.participantEntityIds ?? [],
    relevantThreadIds: errors.relevantThreadIds ?? [],
  };
}

function reportPersistenceError(operation: "create" | "complete", error: unknown) {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name =
    typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
  const code =
    typeof technicalError?.code === "string" ? technicalError.code : "no-code";
  console.error(`[scenes] ${operation} failed (${name}, ${code})`);
}

export async function createSceneAction(
  campaignId: string,
  _state: SceneFormState,
  formData: FormData,
): Promise<SceneFormState> {
  const result = sceneDraftSchema.safeParse({
    title: readText(formData, "title"),
    locationId: readText(formData, "locationId"),
    expectedSetup: readText(formData, "expectedSetup"),
    actualSetup: readText(formData, "actualSetup"),
    objective: readText(formData, "objective"),
    participantCharacterIds: readTextList(formData, "participantCharacterIds"),
    participantEntityIds: readTextList(formData, "participantEntityIds"),
    relevantThreadIds: readTextList(formData, "relevantThreadIds"),
  });
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  let sceneId: string;
  try {
    const scene = await sceneService.create(campaignId, result.data);
    sceneId = scene.id;
  } catch (error) {
    if (error instanceof ActiveSceneExistsError) {
      return { message: "active_exists", errors: normalizeErrors({}) };
    }
    reportPersistenceError("create", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes`);
  redirect(`/campaigns/${campaignId}/scenes/${sceneId}`);
}

export async function completeSceneAction(
  campaignId: string,
  sceneId: string,
  _state: SceneCompletionState,
  formData: FormData,
): Promise<SceneCompletionState> {
  const result = sceneSummarySchema.safeParse(readText(formData, "summary"));
  if (!result.success) {
    return {
      message: "validation",
      errors: result.error.issues.map((issue) => issue.message),
    };
  }
  try {
    await sceneService.complete(campaignId, sceneId, result.data);
  } catch (error) {
    reportPersistenceError("complete", error);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes`);
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  redirect(`/campaigns/${campaignId}/scenes/${sceneId}`);
}
