import { z } from "zod";
import type { NarrativeProvider } from "@/ai/narrative-provider";
import { MockNarrativeProvider } from "@/ai/mock-narrative-provider";
import { OpenAiNarrativeProvider } from "@/ai/openai-narrative-provider";
import { prisma } from "@/db/prisma";
import { PrismaNarrativeRepository } from "@/repositories/prisma/prisma-narrative-repository";
import { loadActiveAiProfile } from "@/services/ai-profile-vault-service";
import { NarrativeService } from "@/services/narrative-service";

const modelSchema = z.string().trim().min(1).max(160);

export async function getNarrativeService(): Promise<NarrativeService> {
  const profile = await loadActiveAiProfile();
  let provider: NarrativeProvider;
  if (profile) {
    provider = new OpenAiNarrativeProvider(
      profile.apiKey,
      profile.model,
      fetch,
      profile.baseUrl,
      profile.provider === "openai" ? "responses" : "chat-completions",
    );
  } else {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    provider = apiKey
      ? new OpenAiNarrativeProvider(apiKey, modelSchema.parse(process.env.OPENAI_MODEL ?? "gpt-5-mini"))
      : new MockNarrativeProvider();
  }
  return new NarrativeService(new PrismaNarrativeRepository(prisma), provider);
}

export async function getNarrativeProviderMode(): Promise<"openai" | "demo"> {
  return (await loadActiveAiProfile()) || process.env.OPENAI_API_KEY?.trim() ? "openai" : "demo";
}
