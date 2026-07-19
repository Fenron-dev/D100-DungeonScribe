"use client";

import { useState } from "react";
import type { AiModelOption } from "@/ai/model-catalog";
import {
  aiProviderDefaults,
  aiProviderIds,
  type AiProviderId,
} from "@/domain/ai-profile";
import { createAiProfileAction } from "@/features/settings/profile-actions";
import { OpenRouterModelField } from "@/features/settings/openrouter-model-field";
import type { MessageCatalog } from "@/i18n/messages";

const providerLabels: Record<AiProviderId, string> = {
  openai: "OpenAI",
  openrouter: "OpenRouter",
  groq: "Groq",
  ollama: "Ollama",
  lmstudio: "LM Studio",
};

export function AiProfileForm({
  copy,
  openRouterCatalogAvailable,
  openRouterModels,
}: {
  copy: MessageCatalog["aiSettings"];
  openRouterCatalogAvailable: boolean;
  openRouterModels: AiModelOption[];
}) {
  const [provider, setProvider] = useState<AiProviderId>("openai");
  const defaults = aiProviderDefaults[provider];
  return (
    <form className="campaign-form" action={createAiProfileAction} key={provider}>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="profile-name">{copy.profileNameLabel}</label>
          <input id="profile-name" name="name" required placeholder={copy.profileNamePlaceholder} />
        </div>
        <div className="form-field">
          <label htmlFor="profile-provider">{copy.providerLabel}</label>
          <select
            id="profile-provider"
            name="provider"
            value={provider}
            onChange={(event) => {
              const selected = aiProviderIds.find((id) => id === event.target.value);
              if (selected) setProvider(selected);
            }}
          >
            {aiProviderIds.map((id) => <option value={id} key={id}>{providerLabels[id]}</option>)}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="profile-base-url">{copy.serverAddressLabel}</label>
        <input id="profile-base-url" name="baseUrl" type="url" defaultValue={defaults.baseUrl} required />
      </div>
      <div className="form-field">
        <label htmlFor="profile-model">{copy.modelLabel}</label>
        {provider === "openrouter" ? (
          <OpenRouterModelField
            defaultValue="openrouter/free"
            catalogAvailable={openRouterCatalogAvailable}
            copy={copy}
            id="profile-model"
            models={openRouterModels}
          />
        ) : <input id="profile-model" name="model" defaultValue={defaults.model} required />}
      </div>
      <div className="form-field">
        <label htmlFor="profile-api-key">
          {copy.apiKeyLabel} {provider === "ollama" || provider === "lmstudio" ? `(${copy.optional})` : ""}
        </label>
        <input id="profile-api-key" name="apiKey" type="password" autoComplete="off" />
        <p className="field-hint">{copy.apiKeyHint}</p>
      </div>
      <button className="button button-primary" type="submit">{copy.saveProfileAction}</button>
    </form>
  );
}
