import { z } from "zod";

export const aiProviderIds = [
  "openai",
  "openrouter",
  "groq",
  "ollama",
  "lmstudio",
] as const;

export type AiProviderId = (typeof aiProviderIds)[number];

export const aiProviderDefaults: Record<AiProviderId, { baseUrl: string; model: string }> = {
  openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-5-mini" },
  openrouter: { baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-5-mini" },
  groq: { baseUrl: "https://api.groq.com/openai/v1", model: "openai/gpt-oss-20b" },
  ollama: { baseUrl: "http://127.0.0.1:11434/v1", model: "gpt-oss:20b" },
  lmstudio: { baseUrl: "http://127.0.0.1:1234/v1", model: "local-model" },
};

const providerSchema = z.enum(aiProviderIds);

export const aiProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(80),
  provider: providerSchema,
  baseUrl: z.string().url().max(300),
  model: z.string().trim().min(1).max(160),
  apiKey: z.string().trim().max(500).nullable(),
});

export type AiProfile = z.infer<typeof aiProfileSchema>;

export const aiProfileVaultSchema = z.object({
  version: z.literal(1),
  activeProfileId: z.string().uuid().nullable(),
  profiles: z.array(aiProfileSchema).max(50),
});

export type AiProfileVault = z.infer<typeof aiProfileVaultSchema>;

export const emptyAiProfileVault: AiProfileVault = {
  version: 1,
  activeProfileId: null,
  profiles: [],
};

export function resolveProviderApiKey(
  profiles: AiProfile[],
  provider: AiProviderId,
  enteredApiKey: string,
): string | null {
  const entered = enteredApiKey.trim();
  if (entered) return entered;
  return profiles.find((profile) => profile.provider === provider && profile.apiKey)?.apiKey ?? null;
}

export function validateProviderUrl(provider: AiProviderId, baseUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return false;
  }
  if (provider === "ollama" || provider === "lmstudio") {
    return url.protocol === "http:" && ["127.0.0.1", "localhost", "::1"].includes(url.hostname);
  }
  return url.protocol === "https:";
}
