import { z } from "zod";
import type { NarrativeProvider } from "@/ai/narrative-provider";
import { MockNarrativeProvider } from "@/ai/mock-narrative-provider";
import { OpenAiNarrativeProvider } from "@/ai/openai-narrative-provider";
import { prisma } from "@/db/prisma";
import { PrismaNarrativeRepository } from "@/repositories/prisma/prisma-narrative-repository";
import { NarrativeService } from "@/services/narrative-service";

const modelSchema = z.string().trim().min(1).max(120);

function createProvider(): NarrativeProvider {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return new MockNarrativeProvider();
  const model = modelSchema.parse(process.env.OPENAI_MODEL ?? "gpt-5.6-luna");
  return new OpenAiNarrativeProvider(apiKey, model);
}

export const narrativeService = new NarrativeService(
  new PrismaNarrativeRepository(prisma),
  createProvider(),
);

export const narrativeProviderMode = process.env.OPENAI_API_KEY?.trim()
  ? "openai"
  : "demo";
