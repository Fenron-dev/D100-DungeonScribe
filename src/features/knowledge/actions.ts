"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  KnowledgeEntryFormErrors,
  KnowledgeEntryFormState,
} from "@/features/knowledge/form-state";
import { knowledgeEntryDraftSchema } from "@/schemas/knowledge-entry";
import { knowledgeEntryService } from "@/services/knowledge-entry-service-instance";

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
  return knowledgeEntryDraftSchema.safeParse({
    title: readText(formData, "title"),
    content: readText(formData, "content"),
    type: readText(formData, "type"),
    truthStatus: readText(formData, "truthStatus"),
    knownByCharacterIds: readTextList(formData, "knownByCharacterIds"),
    relatedEntityIds: readTextList(formData, "relatedEntityIds"),
    locked: formData.get("locked") === "on",
  });
}

function normalizeErrors(
  errors: Partial<Record<keyof KnowledgeEntryFormErrors, string[] | undefined>>,
): KnowledgeEntryFormErrors {
  return {
    title: errors.title ?? [],
    content: errors.content ?? [],
    type: errors.type ?? [],
    truthStatus: errors.truthStatus ?? [],
    knownByCharacterIds: errors.knownByCharacterIds ?? [],
    relatedEntityIds: errors.relatedEntityIds ?? [],
    locked: errors.locked ?? [],
  };
}

function reportPersistenceError(operation: "create" | "update", error: unknown) {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name =
    typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
  const code =
    typeof technicalError?.code === "string" ? technicalError.code : "no-code";
  console.error(`[knowledge] ${operation} failed (${name}, ${code})`);
}

export async function createKnowledgeEntryAction(
  campaignId: string,
  _state: KnowledgeEntryFormState,
  formData: FormData,
): Promise<KnowledgeEntryFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await knowledgeEntryService.create(campaignId, result.data);
  } catch (error) {
    reportPersistenceError("create", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }
  revalidatePath(`/campaigns/${campaignId}/knowledge`);
  redirect(`/campaigns/${campaignId}/knowledge`);
}

export async function updateKnowledgeEntryAction(
  campaignId: string,
  entryId: string,
  _state: KnowledgeEntryFormState,
  formData: FormData,
): Promise<KnowledgeEntryFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await knowledgeEntryService.update(campaignId, entryId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }
  revalidatePath(`/campaigns/${campaignId}/knowledge`);
  redirect(`/campaigns/${campaignId}/knowledge`);
}
