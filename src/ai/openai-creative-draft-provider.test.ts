import { describe, expect, it, vi } from "vitest";
import type { CreativeDraftRequest } from "@/ai/creative-draft-provider";
import type { HttpClient } from "@/ai/http-client";
import { OpenAiCreativeDraftProvider } from "@/ai/openai-creative-draft-provider";

const request: CreativeDraftRequest = {
  locale: "de",
  preference: "Eine ungewöhnliche Reisende",
  variation: 42,
  campaign: {
    name: "Nebelpfade",
    premise: "Verlorene Wege kehren zurück.",
    genre: "Fantasy",
    mood: "Unheimlich",
  },
};

describe("OpenAiCreativeDraftProvider", () => {
  it("requests a non-persisted structured draft and validates the domain result", async () => {
    const httpClient = vi.fn<HttpClient>().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output: [{
          content: [{
            type: "output_text",
            text: JSON.stringify({
              name: "Sera Venn",
              concept: "Eine Reisende, die vergessene Wege hören kann.",
              archetype: "insightful",
              traits: ["Aufmerksam", "Beharrlich"],
              flaw: "Folgt jeder Spur",
              notes: "",
            }),
          }],
        }],
      }),
    });
    const provider = new OpenAiCreativeDraftProvider("test-api-key", "test-model", httpClient);
    await expect(provider.generateCharacter(request)).resolves.toMatchObject({
      name: "Sera Venn",
      archetype: "insightful",
    });
    const [, init] = httpClient.mock.calls[0] ?? [];
    const body = JSON.parse(String(init?.body)) as {
      store: boolean;
      input: string;
      text: { format: { strict: boolean; type: string } };
    };
    expect(body.store).toBe(false);
    expect(body.text.format).toMatchObject({ type: "json_schema", strict: true });
    expect(body.input).not.toContain("knowledge");
    expect(body.input).not.toContain("secret");
  });
});
