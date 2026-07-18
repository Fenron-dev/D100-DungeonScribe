import {
  activateAiProfileAction,
  deleteAiProfileAction,
  testAiProfileAction,
} from "@/features/settings/profile-actions";
import { AiProfileForm } from "@/features/settings/ai-profile-form";
import {
  lockAppAction,
  resetAppPasswordAction,
} from "@/features/settings/security-actions";
import { loadAiProfileVault } from "@/services/ai-profile-vault-service";

export const dynamic = "force-dynamic";

const labels = { openai: "OpenAI", openrouter: "OpenRouter", groq: "Groq", ollama: "Ollama", lmstudio: "LM Studio" } as const;

interface SettingsPageProps {
  searchParams: Promise<{ error?: string; saved?: string; test?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const vault = await loadAiProfileVault();
  if (!vault) return null;
  const status = await searchParams;
  return (
    <div className="settings-page">
      <header className="page-heading">
        <p className="eyebrow">Lokal und verschlüsselt</p>
        <h1>KI-Profile</h1>
        <p>Speichere mehrere Anbieter und Modelle und wechsle mit einem Klick. Schlüssel werden niemals unverschlüsselt abgelegt.</p>
      </header>

      {status.saved === "1" ? <p className="form-message form-message-success" role="status">Profil wurde sicher gespeichert.</p> : null}
      {status.test === "ok" ? <p className="form-message form-message-success" role="status">Verbindung erfolgreich.</p> : null}
      {status.test === "failed" ? <p className="form-message" role="alert">Verbindung fehlgeschlagen. Bitte Serveradresse, Modell und Schlüssel prüfen.</p> : null}
      {status.error ? <p className="form-message" role="alert">Das Profil konnte nicht gespeichert werden. Bitte Eingaben und Schlüssel prüfen.</p> : null}

      <section className="settings-section" aria-labelledby="profiles-title">
        <h2 id="profiles-title">Gespeicherte Profile</h2>
        {vault.profiles.length ? (
          <div className="profile-grid">
            {vault.profiles.map((profile) => {
              const active = profile.id === vault.activeProfileId;
              return (
                <article className={`profile-card ${active ? "profile-active" : ""}`} key={profile.id}>
                  <p className="card-kicker">{labels[profile.provider]}{active ? " · Aktiv" : ""}</p>
                  <h3>{profile.name}</h3>
                  <p>{profile.model}</p>
                  <div className="button-row">
                    <form action={testAiProfileAction.bind(null, profile.id)}>
                      <button className="button button-secondary" type="submit">Verbindung testen</button>
                    </form>
                    {!active ? (
                      <form action={activateAiProfileAction.bind(null, profile.id)}>
                        <button className="button button-primary" type="submit">Aktivieren</button>
                      </form>
                    ) : null}
                    <form action={deleteAiProfileAction.bind(null, profile.id)}>
                      <button className="button button-danger" type="submit">Löschen</button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <p>Noch kein KI-Profil gespeichert. Bis dahin verwendet die App den Demo-Modus.</p>}
      </section>

      <section className="settings-section" aria-labelledby="new-profile-title">
        <h2 id="new-profile-title">Neues Profil</h2>
        <AiProfileForm />
      </section>

      <section className="settings-section danger-zone" aria-labelledby="security-title">
        <h2 id="security-title">App-Schutz</h2>
        <div className="button-row">
          <form action={lockAppAction}><button className="button button-secondary" type="submit">App sperren</button></form>
          <form action={resetAppPasswordAction}><button className="button button-danger" type="submit">Kennwort und KI-Profile zurücksetzen</button></form>
        </div>
      </section>
    </div>
  );
}
