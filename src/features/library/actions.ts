"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { campaignIdSchema } from "@/schemas/campaign";
import { libraryWorldEntityService } from "@/services/library-world-entity-service-instance";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveWorldEntityToLibraryAction(
  campaignId: string,
  entityId: string,
): Promise<void> {
  await libraryWorldEntityService.saveFromCampaign(campaignId, entityId);
  revalidatePath(`/campaigns/${campaignId}/world`);
  revalidatePath("/library");
}

export async function removeWorldEntityFromLibraryAction(
  campaignId: string,
  entityId: string,
): Promise<void> {
  await libraryWorldEntityService.removeBySourceEntityId(entityId);
  revalidatePath(`/campaigns/${campaignId}/world`);
  revalidatePath("/library");
}

export async function removeLibraryWorldEntityAction(
  sourceEntityId: string,
): Promise<void> {
  await libraryWorldEntityService.removeBySourceEntityId(sourceEntityId);
  revalidatePath("/library");
}

export async function copyLibraryWorldEntityAction(
  libraryEntryId: string,
  formData: FormData,
): Promise<void> {
  const campaignId = campaignIdSchema.parse(readText(formData, "campaignId"));
  await libraryWorldEntityService.copyToCampaign(libraryEntryId, campaignId);
  revalidatePath(`/campaigns/${campaignId}/world`);
  redirect(`/campaigns/${campaignId}/world`);
}
