import { describe, expect, it } from "vitest";
import {
  aiProfileVaultSchema,
  resolveProviderApiKey,
  validateProviderUrl,
} from "@/domain/ai-profile";

describe("AI profile security rules", () => {
  it("requires HTTPS for cloud providers", () => {
    expect(validateProviderUrl("openai", "https://api.openai.com/v1")).toBe(true);
    expect(validateProviderUrl("openrouter", "http://openrouter.ai/api/v1")).toBe(false);
    expect(validateProviderUrl("groq", "not a URL")).toBe(false);
  });

  it("allows local providers only on the loopback interface", () => {
    expect(validateProviderUrl("ollama", "http://127.0.0.1:11434/v1")).toBe(true);
    expect(validateProviderUrl("lmstudio", "http://localhost:1234/v1")).toBe(true);
    expect(validateProviderUrl("ollama", "http://192.168.1.20:11434/v1")).toBe(false);
    expect(validateProviderUrl("lmstudio", "https://example.com/v1")).toBe(false);
  });

  it("rejects a vault whose active profile identifier is malformed", () => {
    expect(aiProfileVaultSchema.safeParse({
      version: 1,
      activeProfileId: "invalid",
      profiles: [],
    }).success).toBe(false);
  });

  it("reuses a provider key when another profile leaves it empty", () => {
    const profiles = [{
      id: "8f659b55-9d2b-4b62-a9e2-814d577ff8de",
      name: "OpenRouter Free",
      provider: "openrouter" as const,
      baseUrl: "https://openrouter.ai/api/v1",
      model: "openrouter/free",
      apiKey: "saved",
    }];
    expect(resolveProviderApiKey(profiles, "openrouter", "")).toBe("saved");
    expect(resolveProviderApiKey(profiles, "openrouter", "new")).toBe("new");
    expect(resolveProviderApiKey(profiles, "groq", "")).toBeNull();
  });
});
