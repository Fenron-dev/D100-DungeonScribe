import { z } from "zod";
import type { CreativeDraftProvider } from "@/ai/creative-draft-provider";
import { MockCreativeDraftProvider } from "@/ai/mock-creative-draft-provider";
import { OpenAiCreativeDraftProvider } from "@/ai/openai-creative-draft-provider";
import { CryptoRandomSource } from "@/rules/random-source";
import { CreativeDraftService } from "@/services/creative-draft-service";

const modelSchema = z.string().trim().min(1).max(120);

function createProvider(): CreativeDraftProvider {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return new MockCreativeDraftProvider();
  const model = modelSchema.parse(process.env.OPENAI_MODEL ?? "gpt-5.6-luna");
  return new OpenAiCreativeDraftProvider(apiKey, model);
}

export const creativeDraftService = new CreativeDraftService(
  createProvider(),
  new CryptoRandomSource(),
);

export const creativeDraftProviderMode = process.env.OPENAI_API_KEY?.trim()
  ? "openai"
  : "demo";
