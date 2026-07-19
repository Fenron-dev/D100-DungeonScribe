import {
  activateAiProfileAction,
  deleteAiProfileAction,
  testAiProfileAction,
  updateAiProfileModelAction,
} from "@/features/settings/profile-actions";
import { AiProfileForm } from "@/features/settings/ai-profile-form";
import { OpenRouterModelField } from "@/features/settings/openrouter-model-field";
import {
  lockAppAction,
  resetAppPasswordAction,
} from "@/features/settings/security-actions";
import { loadAiProfileVault } from "@/services/ai-profile-vault-service";
import { listOpenRouterModels } from "@/services/ai-model-catalog-service";
import { getMessages } from "@/i18n/messages";

export const dynamic = "force-dynamic";

const labels = { openai: "OpenAI", openrouter: "OpenRouter", groq: "Groq", ollama: "Ollama", lmstudio: "LM Studio" } as const;

interface SettingsPageProps {
  searchParams: Promise<{ error?: string; saved?: string; test?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const vault = await loadAiProfileVault();
  if (!vault) return null;
  const copy = getMessages().aiSettings;
  const [status, openRouterCatalog] = await Promise.all([
    searchParams,
    listOpenRouterModels(
      vault.profiles.find(({ provider, apiKey }) => provider === "openrouter" && apiKey)?.apiKey ?? null,
    ),
  ]);
  return (
    <div className="settings-page">
      <header className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>

      {status.saved === "1" ? <p className="form-message form-message-success" role="status">{copy.saved}</p> : null}
      {status.test === "ok" ? <p className="form-message form-message-success" role="status">{copy.testOk}</p> : null}
      {status.test === "failed" ? <p className="form-message" role="alert">{copy.testFailed}</p> : null}
      {status.error ? <p className="form-message" role="alert">{copy.saveError}</p> : null}

      <section className="settings-section" aria-labelledby="profiles-title">
        <h2 id="profiles-title">{copy.profilesTitle}</h2>
        {vault.profiles.length ? (
          <div className="profile-grid">
            {vault.profiles.map((profile) => {
              const active = profile.id === vault.activeProfileId;
              return (
                <article className={`profile-card ${active ? "profile-active" : ""}`} key={profile.id}>
                  <p className="card-kicker">{labels[profile.provider]}{active ? ` · ${copy.active}` : ""}</p>
                  <h3>{profile.name}</h3>
                  <p>{profile.model}</p>
                  {profile.provider === "openrouter" ? (
                    <form className="profile-model-form" action={updateAiProfileModelAction.bind(null, profile.id)}>
                      <label htmlFor={`profile-model-${profile.id}`}>{copy.switchModelLabel}</label>
                      <OpenRouterModelField
                        defaultValue={profile.model}
                        catalogAvailable={openRouterCatalog.available}
                        copy={copy}
                        id={`profile-model-${profile.id}`}
                        models={openRouterCatalog.models}
                      />
                      <button className="button button-secondary" type="submit">{copy.saveModelAction}</button>
                    </form>
                  ) : null}
                  <div className="button-row">
                    <form action={testAiProfileAction.bind(null, profile.id)}>
                      <button className="button button-secondary" type="submit">{copy.testAction}</button>
                    </form>
                    {!active ? (
                      <form action={activateAiProfileAction.bind(null, profile.id)}>
                        <button className="button button-primary" type="submit">{copy.activateAction}</button>
                      </form>
                    ) : null}
                    <form action={deleteAiProfileAction.bind(null, profile.id)}>
                      <button className="button button-danger" type="submit">{copy.deleteAction}</button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <p>{copy.empty}</p>}
      </section>

      <section className="settings-section" aria-labelledby="new-profile-title">
        <h2 id="new-profile-title">{copy.newProfileTitle}</h2>
        <AiProfileForm
          copy={copy}
          openRouterCatalogAvailable={openRouterCatalog.available}
          openRouterModels={openRouterCatalog.models}
        />
      </section>

      <section className="settings-section danger-zone" aria-labelledby="security-title">
        <h2 id="security-title">{copy.securityTitle}</h2>
        <div className="button-row">
          <form action={lockAppAction}><button className="button button-secondary" type="submit">{copy.lockAction}</button></form>
          <form action={resetAppPasswordAction}><button className="button button-danger" type="submit">{copy.resetAction}</button></form>
        </div>
      </section>
    </div>
  );
}
