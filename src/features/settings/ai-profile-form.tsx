"use client";

import { useState } from "react";
import {
  aiProviderDefaults,
  aiProviderIds,
  type AiProviderId,
} from "@/domain/ai-profile";
import { createAiProfileAction } from "@/features/settings/profile-actions";

const providerLabels: Record<AiProviderId, string> = {
  openai: "OpenAI",
  openrouter: "OpenRouter",
  groq: "Groq",
  ollama: "Ollama",
  lmstudio: "LM Studio",
};

export function AiProfileForm() {
  const [provider, setProvider] = useState<AiProviderId>("openai");
  const defaults = aiProviderDefaults[provider];
  return (
    <form className="campaign-form" action={createAiProfileAction} key={provider}>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="profile-name">Profilname</label>
          <input id="profile-name" name="name" required placeholder="Zum Beispiel: OpenRouter – günstig" />
        </div>
        <div className="form-field">
          <label htmlFor="profile-provider">Anbieter</label>
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
        <label htmlFor="profile-base-url">Serveradresse</label>
        <input id="profile-base-url" name="baseUrl" type="url" defaultValue={defaults.baseUrl} required />
      </div>
      <div className="form-field">
        <label htmlFor="profile-model">Modell</label>
        <input id="profile-model" name="model" defaultValue={defaults.model} required />
      </div>
      <div className="form-field">
        <label htmlFor="profile-api-key">
          API-Schlüssel {provider === "ollama" || provider === "lmstudio" ? "(optional)" : ""}
        </label>
        <input id="profile-api-key" name="apiKey" type="password" autoComplete="off" />
        <p className="field-hint">Der Schlüssel wird vor dem Speichern mit deinem App-Kennwort verschlüsselt.</p>
      </div>
      <button className="button button-primary" type="submit">Profil speichern</button>
    </form>
  );
}
