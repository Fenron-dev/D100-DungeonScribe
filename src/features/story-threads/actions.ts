"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  StoryThreadFormErrors,
  StoryThreadFormState,
} from "@/features/story-threads/form-state";
import { storyThreadDraftSchema } from "@/schemas/story-thread";
import { storyThreadService } from "@/services/story-thread-service-instance";

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

function parseForm(formData: FormData) {
  return storyThreadDraftSchema.safeParse({
    title: readText(formData, "title"),
    premise: readText(formData, "premise"),
    description: readText(formData, "description"),
    status: readText(formData, "status"),
    urgency: readText(formData, "urgency"),
    progressCurrent: readText(formData, "progressCurrent"),
    progressTarget: readText(formData, "progressTarget"),
    relatedEntityIds: readTextList(formData, "relatedEntityIds"),
    nextPossibleDevelopments: readTextList(
      formData,
      "nextPossibleDevelopments",
    ),
  });
}

function normalizeErrors(
  errors: Partial<Record<keyof StoryThreadFormErrors, string[] | undefined>>,
): StoryThreadFormErrors {
  return {
    title: errors.title ?? [],
    premise: errors.premise ?? [],
    description: errors.description ?? [],
    status: errors.status ?? [],
    urgency: errors.urgency ?? [],
    progressCurrent: errors.progressCurrent ?? [],
    progressTarget: errors.progressTarget ?? [],
    relatedEntityIds: errors.relatedEntityIds ?? [],
    nextPossibleDevelopments: errors.nextPossibleDevelopments ?? [],
  };
}

function reportPersistenceError(operation: "create" | "update", error: unknown) {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name =
    typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
  const code =
    typeof technicalError?.code === "string" ? technicalError.code : "no-code";
  console.error(`[story-threads] ${operation} failed (${name}, ${code})`);
}

export async function createStoryThreadAction(
  campaignId: string,
  _state: StoryThreadFormState,
  formData: FormData,
): Promise<StoryThreadFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await storyThreadService.create(campaignId, result.data);
  } catch (error) {
    reportPersistenceError("create", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }
  revalidatePath(`/campaigns/${campaignId}/threads`);
  redirect(`/campaigns/${campaignId}/threads`);
}

export async function updateStoryThreadAction(
  campaignId: string,
  threadId: string,
  _state: StoryThreadFormState,
  formData: FormData,
): Promise<StoryThreadFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await storyThreadService.update(campaignId, threadId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }
  revalidatePath(`/campaigns/${campaignId}/threads`);
  redirect(`/campaigns/${campaignId}/threads`);
}
