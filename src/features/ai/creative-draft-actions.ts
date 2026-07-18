"use server";

import { z } from "zod";
import type { CampaignDraft } from "@/domain/campaign";
import type { CharacterDraft } from "@/domain/character";
import type { WorldEntityDraft } from "@/domain/world-entity";
import { campaignService } from "@/services/campaign-service-instance";
import { creativeDraftService } from "@/services/creative-draft-service-instance";

const preferenceSchema = z.string().trim().max(500);

export interface CreativeDraftActionResult<T> {
  draft: T | null;
  error: boolean;
  revision: number;
}

function preferenceFrom(formData: FormData): string {
  const value = formData.get("preference");
  return typeof value === "string" ? value : "";
}

function nextRevision(current: number): number {
  return Number.isSafeInteger(current) && current >= 0 ? current + 1 : 1;
}

function reportDraftError(kind: "campaign" | "character" | "world", error: unknown): void {
  const technicalError = error as { name?: unknown };
  const name = typeof technicalError.name === "string" ? technicalError.name : "UnknownError";
  console.error(`[ai] ${kind} draft failed (${name})`);
}

async function campaignContext(campaignId: string): Promise<CampaignDraft | null> {
  const campaign = await campaignService.findById(campaignId);
  if (!campaign || campaign.status !== "active") return null;
  return {
    name: campaign.name,
    premise: campaign.premise,
    genre: campaign.genre,
    mood: campaign.mood,
  };
}

export async function generateCampaignDraftAction(
  state: CreativeDraftActionResult<CampaignDraft>,
  formData: FormData,
): Promise<CreativeDraftActionResult<CampaignDraft>> {
  const parsed = preferenceSchema.safeParse(preferenceFrom(formData));
  if (!parsed.success) return { ...state, error: true };
  try {
    return {
      draft: await creativeDraftService.generateCampaign(parsed.data),
      error: false,
      revision: nextRevision(state.revision),
    };
  } catch (error) {
    reportDraftError("campaign", error);
    return { ...state, error: true };
  }
}

export async function generateCharacterDraftAction(
  campaignId: string,
  state: CreativeDraftActionResult<CharacterDraft>,
  formData: FormData,
): Promise<CreativeDraftActionResult<CharacterDraft>> {
  const parsed = preferenceSchema.safeParse(preferenceFrom(formData));
  if (!parsed.success) return { ...state, error: true };
  try {
    const campaign = await campaignContext(campaignId);
    if (!campaign) return { ...state, error: true };
    return {
      draft: await creativeDraftService.generateCharacter(parsed.data, campaign),
      error: false,
      revision: nextRevision(state.revision),
    };
  } catch (error) {
    reportDraftError("character", error);
    return { ...state, error: true };
  }
}

export async function generateWorldEntityDraftAction(
  campaignId: string,
  state: CreativeDraftActionResult<WorldEntityDraft>,
  formData: FormData,
): Promise<CreativeDraftActionResult<WorldEntityDraft>> {
  const parsed = preferenceSchema.safeParse(preferenceFrom(formData));
  if (!parsed.success) return { ...state, error: true };
  try {
    const campaign = await campaignContext(campaignId);
    if (!campaign) return { ...state, error: true };
    return {
      draft: await creativeDraftService.generateWorldEntity(parsed.data, campaign),
      error: false,
      revision: nextRevision(state.revision),
    };
  } catch (error) {
    reportDraftError("world", error);
    return { ...state, error: true };
  }
}
