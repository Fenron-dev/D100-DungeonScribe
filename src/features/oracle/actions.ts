"use server";

import { revalidatePath } from "next/cache";
import type { OracleFormState } from "@/features/oracle/form-state";
import { yesNoOracleInputSchema } from "@/schemas/oracle";
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
