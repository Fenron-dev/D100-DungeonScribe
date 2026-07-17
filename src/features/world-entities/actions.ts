"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  WorldEntityFormErrors,
  WorldEntityFormState,
} from "@/features/world-entities/form-state";
import { worldEntityDraftSchema } from "@/schemas/world-entity";
import { worldEntityService } from "@/services/world-entity-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseForm(formData: FormData) {
  return worldEntityDraftSchema.safeParse({
    type: readText(formData, "type"),
    name: readText(formData, "name"),
    summary: readText(formData, "summary"),
    description: readText(formData, "description"),
    tags: readText(formData, "tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    status: readText(formData, "status"),
  });
}

function normalizeErrors(
  errors: Partial<Record<keyof WorldEntityFormErrors, string[] | undefined>>,
): WorldEntityFormErrors {
  return {
    type: errors.type ?? [],
    name: errors.name ?? [],
    summary: errors.summary ?? [],
    description: errors.description ?? [],
    tags: errors.tags ?? [],
    status: errors.status ?? [],
  };
}

function reportPersistenceError(
  operation: "create" | "update",
  error: unknown,
): void {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name =
    typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
  const code =
    typeof technicalError?.code === "string" ? technicalError.code : "no-code";
  console.error(`[world-entities] ${operation} failed (${name}, ${code})`);
}

export async function createWorldEntityAction(
  campaignId: string,
  _state: WorldEntityFormState,
  formData: FormData,
): Promise<WorldEntityFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await worldEntityService.create(campaignId, result.data);
  } catch (error) {
    reportPersistenceError("create", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }

  revalidatePath(`/campaigns/${campaignId}/world`);
  redirect(`/campaigns/${campaignId}/world`);
}

export async function updateWorldEntityAction(
  campaignId: string,
  entityId: string,
  _state: WorldEntityFormState,
  formData: FormData,
): Promise<WorldEntityFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await worldEntityService.update(campaignId, entityId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }

  revalidatePath(`/campaigns/${campaignId}/world`);
  redirect(`/campaigns/${campaignId}/world`);
}
