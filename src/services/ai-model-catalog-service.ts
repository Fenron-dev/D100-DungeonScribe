import type { AiModelOption } from "@/ai/model-catalog";
import { OpenRouterModelCatalog } from "@/ai/openrouter-model-catalog";

const fallback: AiModelOption[] = [
  { id: "openrouter/free", name: "Free Models Router", free: true },
];

export async function listOpenRouterModels(apiKey: string | null): Promise<AiModelOption[]> {
  try {
    return await new OpenRouterModelCatalog().list(apiKey);
  } catch {
    return fallback;
  }
}
