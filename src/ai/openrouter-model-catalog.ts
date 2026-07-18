import { z } from "zod";
import type { AiModelCatalog, AiModelOption } from "@/ai/model-catalog";
import type { HttpClient } from "@/ai/http-client";

const responseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
    pricing: z.object({
      prompt: z.string().optional(),
      completion: z.string().optional(),
      request: z.string().optional(),
    }).optional(),
    supported_parameters: z.array(z.string()).optional(),
  })),
});

function hasZeroPrice(value: string | undefined): boolean {
  return value !== undefined && Number(value) === 0;
}

export class OpenRouterModelCatalog implements AiModelCatalog {
  public constructor(private readonly httpClient: HttpClient = fetch) {}

  public async list(apiKey: string | null): Promise<AiModelOption[]> {
    const headers = new Headers({ Accept: "application/json" });
    if (apiKey) headers.set("Authorization", `Bearer ${apiKey}`);
    const response = await this.httpClient(
      "https://openrouter.ai/api/v1/models?supported_parameters=structured_outputs&output_modalities=text&sort=pricing-low-to-high",
      { headers, cache: "no-store", signal: AbortSignal.timeout(5_000) },
    );
    if (!response.ok) throw new Error(`OpenRouter model catalog failed (${response.status})`);
    const parsed = responseSchema.parse(await response.json());
    const models = parsed.data
      .filter(({ supported_parameters: parameters }) =>
        parameters?.includes("structured_outputs") || parameters?.includes("response_format"),
      )
      .map(({ id, name, pricing }) => ({
        id,
        name,
        free: id.endsWith(":free") || (
          hasZeroPrice(pricing?.prompt)
          && hasZeroPrice(pricing?.completion)
          && (!pricing?.request || hasZeroPrice(pricing.request))
        ),
      }));
    return [
      { id: "openrouter/free", name: "Free Models Router", free: true },
      ...models.filter(({ id }) => id !== "openrouter/free"),
    ];
  }
}
