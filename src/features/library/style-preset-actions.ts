"use server";

import { revalidatePath } from "next/cache";
import type { StylePresetFormState } from "@/features/library/style-preset-form-state";
import { campaignStylePresetDraftSchema } from "@/schemas/campaign-style-preset";
import { campaignStylePresetService } from "@/services/campaign-style-preset-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseStyleValue(formData: FormData, key: string): number {
  return Number.parseInt(readText(formData, key), 10);
}

export async function createStylePresetAction(
  _state: StylePresetFormState,
  formData: FormData,
): Promise<StylePresetFormState> {
  const result = campaignStylePresetDraftSchema.safeParse({
    name: readText(formData, "name"),
    description: readText(formData, "description"),
    baseTemplateId: readText(formData, "baseTemplateId"),
    style: {
      seriousness: parseStyleValue(formData, "seriousness"),
      groundedness: parseStyleValue(formData, "groundedness"),
      action: parseStyleValue(formData, "action"),
      combat: parseStyleValue(formData, "combat"),
      sliceOfLife: parseStyleValue(formData, "sliceOfLife"),
      rulesDensity: parseStyleValue(formData, "rulesDensity"),
      danger: parseStyleValue(formData, "danger"),
      lootAmount: parseStyleValue(formData, "lootAmount"),
      lootSignificance: parseStyleValue(formData, "lootSignificance"),
    },
  });
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      message: "validation",
      errors: {
        name: errors.name ?? [],
        description: errors.description ?? [],
        baseTemplateId: errors.baseTemplateId ?? [],
        style: errors.style ?? [],
      },
    };
  }

  try {
    await campaignStylePresetService.create(result.data);
  } catch (error) {
    const technicalError = error as { code?: unknown; name?: unknown };
    const name =
      typeof technicalError.name === "string"
        ? technicalError.name
        : "UnknownError";
    const code =
      typeof technicalError.code === "string"
        ? technicalError.code
        : "no-code";
    console.error(`[library] style preset create failed (${name}, ${code})`);
    return {
      message: "save_error",
      errors: { name: [], description: [], baseTemplateId: [], style: [] },
    };
  }

  revalidatePath("/library");
  revalidatePath("/campaigns/new");
  return {
    message: "saved",
    errors: { name: [], description: [], baseTemplateId: [], style: [] },
  };
}

export async function removeStylePresetAction(id: string): Promise<void> {
  await campaignStylePresetService.remove(id);
  revalidatePath("/library");
  revalidatePath("/campaigns/new");
}
