"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  CharacterFormErrors,
  CharacterFormState,
} from "@/features/characters/form-state";
import { characterDraftSchema } from "@/schemas/character";
import {
  characterInventoryDraftSchema,
  characterInventoryUpdateSchema,
} from "@/schemas/character-inventory";
import { characterInventoryService } from "@/services/character-inventory-service-instance";
import { characterService } from "@/services/character-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseForm(formData: FormData) {
  return characterDraftSchema.safeParse({
    name: readText(formData, "name"),
    concept: readText(formData, "concept"),
    archetype: readText(formData, "archetype"),
    traits: formData
      .getAll("traits")
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean),
    flaw: readText(formData, "flaw"),
    notes: readText(formData, "notes"),
  });
}

function normalizeErrors(
  errors: Partial<Record<keyof CharacterFormErrors, string[] | undefined>>,
): CharacterFormErrors {
  return {
    name: errors.name ?? [],
    concept: errors.concept ?? [],
    archetype: errors.archetype ?? [],
    traits: errors.traits ?? [],
    flaw: errors.flaw ?? [],
    notes: errors.notes ?? [],
  };
}

function reportPersistenceError(
  operation: "create" | "update" | "inventory",
  error: unknown,
): void {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name =
    typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
  const code =
    typeof technicalError?.code === "string" ? technicalError.code : "no-code";
  console.error(`[characters] ${operation} failed (${name}, ${code})`);
}

export async function addCharacterInventoryAction(
  campaignId: string,
  characterId: string,
  formData: FormData,
): Promise<void> {
  try {
    await characterInventoryService.add(
      campaignId,
      characterId,
      characterInventoryDraftSchema.parse({
        itemId: readText(formData, "itemId"),
        quantity: readText(formData, "quantity"),
        equipped: readText(formData, "equipped") === "on",
        notes: readText(formData, "notes"),
      }),
    );
  } catch (error) {
    reportPersistenceError("inventory", error);
  }
  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/characters/${characterId}/edit`);
}

export async function updateCharacterInventoryAction(
  campaignId: string,
  characterId: string,
  entryId: string,
  formData: FormData,
): Promise<void> {
  try {
    await characterInventoryService.update(
      campaignId,
      characterId,
      entryId,
      characterInventoryUpdateSchema.parse({
        quantity: readText(formData, "quantity"),
        equipped: readText(formData, "equipped") === "on",
        notes: readText(formData, "notes"),
      }),
    );
  } catch (error) {
    reportPersistenceError("inventory", error);
  }
  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/characters/${characterId}/edit`);
}

export async function removeCharacterInventoryAction(
  campaignId: string,
  characterId: string,
  entryId: string,
  _formData: FormData,
): Promise<void> {
  void _formData;
  try {
    await characterInventoryService.remove(campaignId, characterId, entryId);
  } catch (error) {
    reportPersistenceError("inventory", error);
  }
  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/characters/${characterId}/edit`);
}

export async function createCharacterAction(
  campaignId: string,
  _state: CharacterFormState,
  formData: FormData,
): Promise<CharacterFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }

  try {
    await characterService.create(campaignId, result.data);
  } catch (error) {
    reportPersistenceError("create", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

export async function updateCharacterAction(
  campaignId: string,
  characterId: string,
  _state: CharacterFormState,
  formData: FormData,
): Promise<CharacterFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }

  try {
    await characterService.update(campaignId, characterId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return { message: "save_error", errors: normalizeErrors({}) };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/characters/${characterId}/edit`);
  redirect(`/campaigns/${campaignId}`);
}
