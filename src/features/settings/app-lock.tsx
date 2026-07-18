"use client";

import { useActionState } from "react";
import {
  setupAppPasswordAction,
  unlockAppAction,
  resetAppPasswordAction,
} from "@/features/settings/security-actions";
import type { MessageCatalog } from "@/i18n/messages";

interface LockFormState { error: boolean }
const initialLockFormState: LockFormState = { error: false };

export function AppLock({
  configured,
  copy,
}: {
  configured: boolean;
  copy: MessageCatalog["aiSettings"];
}) {
  const action = configured ? unlockAppAction : setupAppPasswordAction;
  const [state, formAction, pending] = useActionState(action, initialLockFormState);
  return (
    <main className="lock-page" id="main-content">
      <section className="lock-card">
        <p className="eyebrow">{copy.lockEyebrow}</p>
        <h1>{configured ? copy.unlockTitle : copy.setupTitle}</h1>
        <p>
          {configured
            ? copy.unlockDescription
            : copy.setupDescription}
        </p>
        {state.error ? (
          <p className="form-message" role="alert">
            {configured
              ? copy.invalidUnlockMessage
              : copy.setupPasswordError}
          </p>
        ) : null}
        <form action={formAction} className="lock-form">
          <div className="form-field">
            <label htmlFor="app-password">{copy.passwordLabel}</label>
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
              <label htmlFor="app-password-confirmation">{copy.passwordRepeatLabel}</label>
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
            {pending ? copy.waitingAction : configured ? copy.unlockAction : copy.savePasswordAction}
          </button>
        </form>
        {configured ? (
          <form action={resetAppPasswordAction}>
            <button className="text-link button-link" type="submit">
              {copy.forgotPasswordAction}
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
