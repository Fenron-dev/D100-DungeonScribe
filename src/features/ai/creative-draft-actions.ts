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
  preference: string,
): Promise<CreativeDraftActionResult<CampaignDraft>> {
  const parsed = preferenceSchema.safeParse(preference);
  if (!parsed.success) return { draft: null, error: true };
  try {
    return { draft: await creativeDraftService.generateCampaign(parsed.data), error: false };
  } catch (error) {
    reportDraftError("campaign", error);
    return { draft: null, error: true };
  }
}

export async function generateCharacterDraftAction(
  campaignId: string,
  preference: string,
): Promise<CreativeDraftActionResult<CharacterDraft>> {
  const parsed = preferenceSchema.safeParse(preference);
  if (!parsed.success) return { draft: null, error: true };
  try {
    const campaign = await campaignContext(campaignId);
    if (!campaign) return { draft: null, error: true };
    return {
      draft: await creativeDraftService.generateCharacter(parsed.data, campaign),
      error: false,
    };
  } catch (error) {
    reportDraftError("character", error);
    return { draft: null, error: true };
  }
}

export async function generateWorldEntityDraftAction(
  campaignId: string,
  preference: string,
): Promise<CreativeDraftActionResult<WorldEntityDraft>> {
  const parsed = preferenceSchema.safeParse(preference);
  if (!parsed.success) return { draft: null, error: true };
  try {
    const campaign = await campaignContext(campaignId);
    if (!campaign) return { draft: null, error: true };
    return {
      draft: await creativeDraftService.generateWorldEntity(parsed.data, campaign),
      error: false,
    };
  } catch (error) {
    reportDraftError("world", error);
    return { draft: null, error: true };
  }
}
