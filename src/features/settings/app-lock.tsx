"use client";

import { useActionState } from "react";
import {
  setupAppPasswordAction,
  unlockAppAction,
  resetAppPasswordAction,
} from "@/features/settings/security-actions";

interface LockFormState { error: boolean }
const initialLockFormState: LockFormState = { error: false };

export function AppLock({ configured }: { configured: boolean }) {
  const action = configured ? unlockAppAction : setupAppPasswordAction;
  const [state, formAction, pending] = useActionState(action, initialLockFormState);
  return (
    <main className="lock-page" id="main-content">
      <section className="lock-card">
        <p className="eyebrow">Privater Bereich</p>
        <h1>{configured ? "D100 DungeonScribe entsperren" : "App-Kennwort festlegen"}</h1>
        <p>
          {configured
            ? "Deine KI-Profile werden erst nach der Eingabe im Arbeitsspeicher entschlüsselt."
            : "Das Kennwort schützt deine verschlüsselten KI-Profile. Es wird nicht gespeichert und kann nicht wiederhergestellt werden."}
        </p>
        {state.error ? (
          <p className="form-message" role="alert">
            {configured
              ? "Das Kennwort ist nicht richtig."
              : "Beide Eingaben müssen übereinstimmen und mindestens zehn Zeichen enthalten."}
          </p>
        ) : null}
        <form action={formAction} className="lock-form">
          <div className="form-field">
            <label htmlFor="app-password">Kennwort</label>
            <input
              id="app-password"
              name="password"
              type="password"
              minLength={10}
              maxLength={200}
              required
              autoComplete={configured ? "current-password" : "new-password"}
              autoFocus
            />
          </div>
          {!configured ? (
            <div className="form-field">
              <label htmlFor="app-password-confirmation">Kennwort wiederholen</label>
              <input
                id="app-password-confirmation"
                name="passwordConfirmation"
                type="password"
                minLength={10}
                maxLength={200}
                required
                autoComplete="new-password"
              />
            </div>
          ) : null}
          <button className="button button-primary" disabled={pending} type="submit">
            {pending ? "Bitte warten …" : configured ? "Entsperren" : "Kennwort speichern"}
          </button>
        </form>
        {configured ? (
          <form action={resetAppPasswordAction}>
            <button className="text-link button-link" type="submit">
              Kennwort vergessen? Nur KI-Profile zurücksetzen
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
