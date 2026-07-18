"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NarrativeProviderError } from "@/ai/narrative-provider";
import type {
  SceneCompletionState,
  SceneFormErrors,
  SceneFormState,
  SceneJournalFormState,
} from "@/features/scenes/form-state";
import { sceneCompletionInputSchema, sceneDraftSchema } from "@/schemas/scene";
import {
  diceRollDraftSchema,
  sceneMessageContentSchema,
  sceneNoteContentSchema,
  sceneMessageDraftSchema,
  sceneNoteDraftSchema,
} from "@/schemas/scene-journal";
import { SceneTraitMismatchError } from "@/services/scene-journal-service";
import { sceneJournalService } from "@/services/scene-journal-service-instance";
import { getNarrativeService } from "@/services/narrative-service-instance";
import { ActiveSceneExistsError } from "@/services/scene-service";
import { sceneService } from "@/services/scene-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function addSceneNoteAction(
  campaignId: string,
  sceneId: string,
  _state: SceneJournalFormState,
  formData: FormData,
): Promise<SceneJournalFormState> {
  const result = sceneNoteDraftSchema.safeParse({
    kind: readText(formData, "kind"),
    content: readText(formData, "content"),
  });
  if (!result.success) {
    return { message: "validation", errors: result.error.issues.map(({ message }) => message) };
  }
  try {
    await sceneJournalService.addNote(campaignId, sceneId, result.data);
  } catch (error) {
    reportPersistenceError("create", error);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}

export async function addSceneMessageAction(
  campaignId: string,
  sceneId: string,
  _state: SceneJournalFormState,
  formData: FormData,
): Promise<SceneJournalFormState> {
  const asksGameMaster = readText(formData, "submitMode") === "ask-game-master";
  const result = sceneMessageDraftSchema.safeParse({
    role: readText(formData, "role"),
    content: readText(formData, "content"),
  });
  if (!result.success) {
    return {
      message: "validation",
      errors: result.error.issues.map(({ message }) => message),
    };
  }
  if (asksGameMaster && result.data.role !== "player") {
    return { message: "validation", errors: [] };
  }
  try {
    await sceneJournalService.addMessage(campaignId, sceneId, result.data);
  } catch (error) {
    reportPersistenceError("create", error);
    return { message: "save_error", errors: [] };
  }
  if (asksGameMaster) {
    try {
      const narration = await (await getNarrativeService()).narrate(
        campaignId,
        sceneId,
        result.data.content,
      );
      if (!narration) {
        revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
        return { message: "save_error", errors: [] };
      }
    } catch (error) {
      revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
      if (error instanceof NarrativeProviderError) {
        return { message: error.reason, errors: [] };
      }
      reportPersistenceError("create", error);
      return { message: "provider_error", errors: [] };
    }
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}

export async function updateSceneNoteAction(
  campaignId: string,
  sceneId: string,
  noteId: string,
  _state: SceneJournalFormState,
  formData: FormData,
): Promise<SceneJournalFormState> {
  const result = sceneNoteContentSchema.safeParse({ content: readText(formData, "content") });
  if (!result.success) {
    return { message: "validation", errors: result.error.issues.map(({ message }) => message) };
  }
  try {
    await sceneJournalService.updateNote(campaignId, sceneId, noteId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}

export async function updateSceneMessageAction(
  campaignId: string,
  sceneId: string,
  messageId: string,
  _state: SceneJournalFormState,
  formData: FormData,
): Promise<SceneJournalFormState> {
  const result = sceneMessageContentSchema.safeParse({ content: readText(formData, "content") });
  if (!result.success) {
    return { message: "validation", errors: result.error.issues.map(({ message }) => message) };
  }
  try {
    await sceneJournalService.updateMessage(campaignId, sceneId, messageId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}

export async function rollSceneCheckAction(
  campaignId: string,
  sceneId: string,
  _state: SceneJournalFormState,
  formData: FormData,
): Promise<SceneJournalFormState> {
  const result = diceRollDraftSchema.safeParse({
    characterId: readText(formData, "characterId"),
    action: readText(formData, "action"),
    difficulty: readText(formData, "difficulty"),
    archetypeMatches: formData.get("archetypeMatches") === "on",
    matchingTrait: readText(formData, "matchingTrait"),
    advantage: readText(formData, "advantage"),
    disadvantage: readText(formData, "disadvantage"),
  });
  if (!result.success) {
    return { message: "validation", errors: result.error.issues.map(({ message }) => message) };
  }
  try {
    await sceneJournalService.roll(campaignId, sceneId, result.data);
  } catch (error) {
    if (error instanceof SceneTraitMismatchError) {
      return { message: "trait_mismatch", errors: [] };
    }
    reportPersistenceError("create", error);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
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

function reportPersistenceError(operation: "create" | "update" | "complete", error: unknown) {
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
  const result = sceneCompletionInputSchema.safeParse({
    summary: readText(formData, "summary"),
    tensionAdjustment: readText(formData, "tensionAdjustment"),
  });
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
