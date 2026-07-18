import { describe, expect, it } from "vitest";
import { aiProfileVaultSchema, validateProviderUrl } from "@/domain/ai-profile";

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
});
