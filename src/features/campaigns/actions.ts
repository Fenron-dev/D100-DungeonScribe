"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  CampaignFormErrors,
  CampaignFormState,
} from "@/features/campaigns/form-state";
import { campaignDraftSchema } from "@/schemas/campaign";
import { campaignService } from "@/services/campaign-service-instance";

function reportPersistenceError(
  operation: "create" | "update" | "archive",
  error: unknown,
): void {
  const technicalError = error as { code?: unknown; name?: unknown };
  const name =
    typeof technicalError?.name === "string" ? technicalError.name : "UnknownError";
  const code =
    typeof technicalError?.code === "string" ? technicalError.code : "no-code";

  console.error(`[campaigns] ${operation} failed (${name}, ${code})`);
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseForm(formData: FormData) {
  return campaignDraftSchema.safeParse({
    name: readText(formData, "name"),
    premise: readText(formData, "premise"),
    genre: readText(formData, "genre"),
    mood: readText(formData, "mood"),
  });
}

function normalizeErrors(
  errors: Partial<Record<keyof CampaignFormErrors, string[] | undefined>>,
): CampaignFormErrors {
  return {
    name: errors.name ?? [],
    premise: errors.premise ?? [],
    genre: errors.genre ?? [],
    mood: errors.mood ?? [],
  };
}

export async function createCampaignAction(
  _state: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }

  let campaignId: string;
  try {
    const campaign = await campaignService.create(result.data);
    campaignId = campaign.id;
  } catch (error) {
    reportPersistenceError("create", error);
    return {
      message: "save_error",
      errors: normalizeErrors({}),
    };
  }

  revalidatePath("/");
  revalidatePath("/campaigns");
  redirect(`/campaigns/${campaignId}`);
}

export async function updateCampaignAction(
  campaignId: string,
  _state: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      message: "validation",
      errors: normalizeErrors(result.error.flatten().fieldErrors),
    };
  }

  try {
    await campaignService.update(campaignId, result.data);
  } catch (error) {
    reportPersistenceError("update", error);
    return {
      message: "save_error",
      errors: normalizeErrors({}),
    };
  }

  revalidatePath("/");
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

export async function archiveCampaignAction(campaignId: string): Promise<void> {
  try {
    await campaignService.archive(campaignId);
  } catch (error) {
    reportPersistenceError("archive", error);
    redirect("/campaigns");
  }

  revalidatePath("/");
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}
