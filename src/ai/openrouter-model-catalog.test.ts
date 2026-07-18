import { describe, expect, it, vi } from "vitest";
import type { HttpClient } from "@/ai/http-client";
import { OpenRouterModelCatalog } from "@/ai/openrouter-model-catalog";

describe("OpenRouterModelCatalog", () => {
  it("marks zero-cost structured-output models as free", async () => {
    const httpClient = vi.fn<HttpClient>().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [
        {
          id: "example/story-model:free",
          name: "Story Model Free",
          pricing: { prompt: "0", completion: "0", request: "0" },
          supported_parameters: ["structured_outputs", "max_tokens"],
        },
        {
          id: "example/paid-model",
          name: "Paid Model",
          pricing: { prompt: "0.000001", completion: "0.000002", request: "0" },
          supported_parameters: ["structured_outputs"],
        },
      ] }),
    });
    const models = await new OpenRouterModelCatalog(httpClient).list("test-key");
    expect(models).toEqual([
      { id: "openrouter/free", name: "Free Models Router", free: true },
      { id: "example/story-model:free", name: "Story Model Free", free: true },
      { id: "example/paid-model", name: "Paid Model", free: false },
    ]);
    const [, init] = httpClient.mock.calls[0] ?? [];
    expect(init?.headers).toBeInstanceOf(Headers);
  });
});
