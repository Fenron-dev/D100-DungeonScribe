import { z } from "zod";
import type { CreativeDraftProvider } from "@/ai/creative-draft-provider";
import { MockCreativeDraftProvider } from "@/ai/mock-creative-draft-provider";
import { OpenAiCreativeDraftProvider } from "@/ai/openai-creative-draft-provider";
import { CryptoRandomSource } from "@/rules/random-source";
import { loadActiveAiProfile } from "@/services/ai-profile-vault-service";
import { CreativeDraftService } from "@/services/creative-draft-service";

const modelSchema = z.string().trim().min(1).max(160);

export async function getCreativeDraftService(): Promise<CreativeDraftService> {
  const profile = await loadActiveAiProfile();
  let provider: CreativeDraftProvider;
  if (profile) {
    provider = new OpenAiCreativeDraftProvider(
      profile.apiKey,
      profile.model,
      fetch,
      profile.baseUrl,
      profile.provider === "openai" ? "responses" : "chat-completions",
    );
  } else {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    provider = apiKey
      ? new OpenAiCreativeDraftProvider(apiKey, modelSchema.parse(process.env.OPENAI_MODEL ?? "gpt-5-mini"))
      : new MockCreativeDraftProvider();
  }
  return new CreativeDraftService(provider, new CryptoRandomSource());
}

export async function getCreativeDraftProviderMode(): Promise<"openai" | "demo"> {
  return (await loadActiveAiProfile()) || process.env.OPENAI_API_KEY?.trim() ? "openai" : "demo";
}
