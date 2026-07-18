"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  aiProfileSchema,
  aiProviderIds,
  validateProviderUrl,
} from "@/domain/ai-profile";
import {
  loadAiProfileVault,
  saveAiProfileVault,
} from "@/services/ai-profile-vault-service";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  provider: z.enum(aiProviderIds),
  baseUrl: z.string().url().max(300),
  model: z.string().trim().min(1).max(160),
  apiKey: z.string().trim().max(500),
});

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createAiProfileAction(formData: FormData): Promise<void> {
  const parsed = inputSchema.safeParse({
    name: text(formData, "name"),
    provider: text(formData, "provider"),
    baseUrl: text(formData, "baseUrl"),
    model: text(formData, "model"),
    apiKey: text(formData, "apiKey"),
  });
  if (!parsed.success || !validateProviderUrl(parsed.data.provider, parsed.data.baseUrl)) {
    redirect("/settings?error=profile");
  }
  const local = parsed.data.provider === "ollama" || parsed.data.provider === "lmstudio";
  if (!local && parsed.data.apiKey.length === 0) redirect("/settings?error=key");
  const vault = await loadAiProfileVault();
  if (!vault) redirect("/");
  const profile = aiProfileSchema.parse({
    ...parsed.data,
    id: randomUUID(),
    apiKey: parsed.data.apiKey || null,
  });
  await saveAiProfileVault({
    ...vault,
    profiles: [...vault.profiles, profile],
    activeProfileId: vault.activeProfileId ?? profile.id,
  });
  revalidatePath("/settings");
  redirect("/settings?saved=1");
}

export async function activateAiProfileAction(profileId: string): Promise<void> {
  const vault = await loadAiProfileVault();
  if (!vault || !vault.profiles.some(({ id }) => id === profileId)) return;
  await saveAiProfileVault({ ...vault, activeProfileId: profileId });
  revalidatePath("/", "layout");
}

export async function deleteAiProfileAction(profileId: string): Promise<void> {
  const vault = await loadAiProfileVault();
  if (!vault) return;
  const profiles = vault.profiles.filter(({ id }) => id !== profileId);
  await saveAiProfileVault({
    ...vault,
    profiles,
    activeProfileId: vault.activeProfileId === profileId ? profiles[0]?.id ?? null : vault.activeProfileId,
  });
  revalidatePath("/settings");
}

export async function testAiProfileAction(profileId: string): Promise<void> {
  const vault = await loadAiProfileVault();
  const profile = vault?.profiles.find(({ id }) => id === profileId);
  if (!profile) redirect("/settings?test=failed");
  let connected = false;
  try {
    const headers = new Headers({ Accept: "application/json" });
    if (profile.apiKey) headers.set("Authorization", `Bearer ${profile.apiKey}`);
    const response = await fetch(`${profile.baseUrl.replace(/\/$/, "")}/models`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    connected = response.ok;
  } catch {
    connected = false;
  }
  redirect(`/settings?test=${connected ? "ok" : "failed"}`);
}
