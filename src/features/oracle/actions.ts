"use server";

import { revalidatePath } from "next/cache";
import type { OracleFormState } from "@/features/oracle/form-state";
import {
  inspirationInputSchema,
  randomEventInputSchema,
  yesNoOracleInputSchema,
} from "@/schemas/oracle";
import { oracleService } from "@/services/oracle-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function askOracleAction(
  campaignId: string,
  sceneId: string,
  _state: OracleFormState,
  formData: FormData,
): Promise<OracleFormState> {
  const result = yesNoOracleInputSchema.safeParse({
    question: readText(formData, "question"),
    likelihood: readText(formData, "likelihood"),
  });
  if (!result.success) {
    return {
      message: "validation",
      errors: result.error.issues.map(({ message }) => message),
    };
  }
  try {
    await oracleService.askYesNo(campaignId, sceneId, result.data);
  } catch (error) {
    const technicalError = error as { name?: unknown };
    const name =
      typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
    console.error(`[oracle] question failed (${name})`);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}

export async function drawInspirationAction(
  campaignId: string,
  sceneId: string,
  _state: OracleFormState,
  formData: FormData,
): Promise<OracleFormState> {
  const result = inspirationInputSchema.safeParse({
    question: readText(formData, "question"),
    primaryCategory: readText(formData, "primaryCategory"),
    secondaryCategory: readText(formData, "secondaryCategory"),
  });
  if (!result.success) {
    return {
      message: "validation",
      errors: result.error.issues.map(({ message }) => message),
    };
  }
  try {
    await oracleService.drawInspiration(campaignId, sceneId, result.data);
  } catch (error) {
    const technicalError = error as { name?: unknown };
    const name =
      typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
    console.error(`[oracle] inspiration failed (${name})`);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}

export async function generateRandomEventAction(
  campaignId: string,
  sceneId: string,
  _state: OracleFormState,
  formData: FormData,
): Promise<OracleFormState> {
  const result = randomEventInputSchema.safeParse({
    context: readText(formData, "context"),
    trigger: "manual",
  });
  if (!result.success) {
    return {
      message: "validation",
      errors: result.error.issues.map(({ message }) => message),
    };
  }
  try {
    await oracleService.generateRandomEvent(campaignId, sceneId, result.data);
  } catch (error) {
    const technicalError = error as { name?: unknown };
    const name =
      typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
    console.error(`[oracle] random event failed (${name})`);
    return { message: "save_error", errors: [] };
  }
  revalidatePath(`/campaigns/${campaignId}/scenes/${sceneId}`);
  return { message: null, errors: [] };
}
