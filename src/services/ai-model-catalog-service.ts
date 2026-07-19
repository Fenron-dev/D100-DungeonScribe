import type { AiModelOption } from "@/ai/model-catalog";
import { OpenRouterModelCatalog } from "@/ai/openrouter-model-catalog";

const fallback: AiModelOption[] = [
  { id: "openrouter/free", name: "Free Models Router", free: true },
];

export interface OpenRouterModelCatalogResult {
  models: AiModelOption[];
  available: boolean;
}

export async function listOpenRouterModels(apiKey: string | null): Promise<OpenRouterModelCatalogResult> {
  try {
    return {
      models: await new OpenRouterModelCatalog().list(apiKey),
      available: true,
    };
  } catch {
    return { models: fallback, available: false };
  }
}
