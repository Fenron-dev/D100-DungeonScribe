"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  RelationFormErrors,
  RelationFormState,
} from "@/features/world-entities/relation-form-state";
import { worldEntityRelationDraftSchema } from "@/schemas/world-entity";
import { worldEntityService } from "@/services/world-entity-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function emptyErrors(
  errors: Partial<Record<keyof RelationFormErrors, string[] | undefined>> = {},
): RelationFormErrors {
  return {
    targetEntityId: errors.targetEntityId ?? [],
    type: errors.type ?? [],
    description: errors.description ?? [],
    status: errors.status ?? [],
  };
}

function reportRelationError(operation: "create" | "remove", error: unknown) {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name = typeof technicalError.name === "string" ? technicalError.name : "UnknownError";
  const code = typeof technicalError.code === "string" ? technicalError.code : "no-code";
  console.error(`[world-relations] ${operation} failed (${name}, ${code})`);
}

export async function createWorldEntityRelationAction(
  campaignId: string,
  sourceEntityId: string,
  _state: RelationFormState,
  formData: FormData,
): Promise<RelationFormState> {
  const result = worldEntityRelationDraftSchema.safeParse({
    targetEntityId: readText(formData, "targetEntityId"),
    type: readText(formData, "relationType"),
    description: readText(formData, "relationDescription"),
    status: readText(formData, "relationStatus"),
  });
  if (!result.success) {
    return {
      message: "validation",
      errors: emptyErrors(result.error.flatten().fieldErrors),
    };
  }
  try {
    await worldEntityService.createRelation(campaignId, sourceEntityId, result.data);
  } catch (error) {
    reportRelationError("create", error);
    return { message: "save_error", errors: emptyErrors() };
  }
  const path = `/campaigns/${campaignId}/world/${sourceEntityId}/edit`;
  revalidatePath(path);
  redirect(path);
}

export async function removeWorldEntityRelationAction(
  campaignId: string,
  sourceEntityId: string,
  formData: FormData,
): Promise<void> {
  try {
    await worldEntityService.removeRelation(
      campaignId,
      sourceEntityId,
      readText(formData, "relationId"),
    );
  } catch (error) {
    reportRelationError("remove", error);
    return;
  }
  revalidatePath(`/campaigns/${campaignId}/world/${sourceEntityId}/edit`);
}
