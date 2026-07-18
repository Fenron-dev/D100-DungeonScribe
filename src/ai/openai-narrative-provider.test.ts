import { describe, expect, it, vi } from "vitest";
import {
  OpenAiNarrativeProvider,
} from "@/ai/openai-narrative-provider";
import { NarrativeProviderError } from "@/ai/narrative-provider";
import type { HttpClient } from "@/ai/http-client";
import type { NarrationRequest } from "@/ai/narrative-provider";
import { defaultCampaignStyle } from "@/domain/campaign-style";

const request: NarrationRequest = {
  locale: "de",
  direction: "Beschreibe ein Geräusch",
  context: {
    campaign: {
      name: "Test",
      premise: "Nebel",
      genre: null,
      mood: null,
      tension: 3,
      futureIdeas: null,
      style: defaultCampaignStyle,
    },
    scene: {
      title: "Turm",
      actualSetup: "Die Tür steht offen.",
      objective: null,
      participants: ["Elara"],
      activeThreads: [],
      recentMessages: [
        { role: "player", content: "Ich betrete den Turm." },
        { role: "narrator", content: "Die Tür fällt hinter dir zu." },
      ],
    },
  },
};

describe("OpenAiNarrativeProvider", () => {
  it("uses the Responses API and validates structured output", async () => {
    const httpClient = vi.fn<HttpClient>().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output: [
          { type: "reasoning" },
          {
            type: "message",
            content: [{ type: "output_text", text: '{"narration":"Etwas kratzt an der Tür."}' }],
          },
        ],
      }),
    });
    const provider = new OpenAiNarrativeProvider("test-api-key", "test-model", httpClient);
    await expect(provider.generateNarration(request)).resolves.toEqual({
      narration: "Etwas kratzt an der Tür.",
    });
    expect(httpClient).toHaveBeenCalledOnce();
    const [, init] = httpClient.mock.calls[0] ?? [];
    expect(init?.headers).toMatchObject({ Authorization: "Bearer test-api-key" });
    const body = JSON.parse(String(init?.body)) as {
      store: boolean;
      input: string;
      instructions: string;
      text: { format: { strict: boolean; type: string } };
    };
    expect(body.store).toBe(false);
    expect(body.text.format).toMatchObject({ type: "json_schema", strict: true });
    expect(body.input).toContain("Die Tür fällt hinter dir zu.");
    expect(body.instructions).toContain("Never replay");
  });

  it("rejects refusals before they cross the provider boundary", async () => {
    const httpClient: HttpClient = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        output: [{ content: [{ type: "refusal", refusal: "Cannot comply" }] }],
      }),
    });
    const provider = new OpenAiNarrativeProvider("test-api-key", "test-model", httpClient);
    await expect(provider.generateNarration(request)).rejects.toBeInstanceOf(
      NarrativeProviderError,
    );
  });

  it("uses the compatible chat endpoint for non-OpenAI profiles", async () => {
    const httpClient = vi.fn<HttpClient>().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: '{"narration":"Der Nebel teilt sich."}' } }],
      }),
    });
    const provider = new OpenAiNarrativeProvider(
      null,
      "local-model",
      httpClient,
      "http://127.0.0.1:1234/v1",
      "chat-completions",
    );
    await expect(provider.generateNarration(request)).resolves.toEqual({
      narration: "Der Nebel teilt sich.",
    });
    expect(httpClient.mock.calls[0]?.[0]).toBe("http://127.0.0.1:1234/v1/chat/completions");
    const [, init] = httpClient.mock.calls[0] ?? [];
    expect(init?.headers).not.toMatchObject({ Authorization: expect.any(String) });
    const body = JSON.parse(String(init?.body)) as { response_format: { type: string } };
    expect(body.response_format.type).toBe("json_schema");
  });

  it("classifies a free-provider rate limit without exposing response data", async () => {
    const provider = new OpenAiNarrativeProvider(
      "test-api-key",
      "openrouter/free",
      async () => ({ ok: false, status: 429, json: async () => ({ secret: "ignored" }) }),
      "https://openrouter.ai/api/v1",
      "chat-completions",
    );
    await expect(provider.generateNarration(request)).rejects.toMatchObject({
      name: "NarrativeProviderError",
      reason: "rate_limit",
      message: "AI request failed (429)",
    });
  });
});
