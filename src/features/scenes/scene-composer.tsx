"use client";

import { useActionState, useState } from "react";
import {
  initialSceneJournalFormState,
  type SceneJournalFormAction,
} from "@/features/scenes/form-state";
import type { getMessages } from "@/i18n/messages";

export interface SceneAiProfileOption {
  id: string;
  label: string;
}

export function SceneComposer({
  action,
  messages,
  profiles,
  activeProfileId,
}: {
  action: SceneJournalFormAction;
  messages: ReturnType<typeof getMessages>;
  profiles: SceneAiProfileOption[];
  activeProfileId: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialSceneJournalFormState);
  const [mode, setMode] = useState("player_ask");
  const copy = messages.scenes;
  const asksAi = mode === "player_ask";
  return (
    <form className="scene-composer" action={formAction} noValidate>
      {state.message ? (
        <p className="scene-composer-error" role="alert">{copy.composerError}</p>
      ) : null}
      <label className="visually-hidden" htmlFor="scene-composer-mode">{copy.composerModeLabel}</label>
      <select
        id="scene-composer-mode"
        name="mode"
        onChange={(event) => setMode(event.target.value)}
        value={mode}
      >
        <option value="player_ask">{copy.composerModes.player_ask}</option>
        <option value="player_log">{copy.composerModes.player_log}</option>
        <option value="narrator">{copy.composerModes.narrator}</option>
        <option value="action">{copy.composerModes.action}</option>
        <option value="observation">{copy.composerModes.observation}</option>
        <option value="event">{copy.composerModes.event}</option>
      </select>
      <label className="visually-hidden" htmlFor="scene-composer-content">{copy.composerContentLabel}</label>
      <textarea
        id="scene-composer-content"
        name="content"
        maxLength={8_000}
        placeholder={copy.composerPlaceholder}
        required
        rows={2}
      />
      {asksAi && profiles.length > 0 ? (
        <label className="scene-composer-model" htmlFor="scene-composer-profile">
          <span>{copy.composerModelLabel}</span>
          <select id="scene-composer-profile" name="profileId" defaultValue={activeProfileId}>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>{profile.label}</option>
            ))}
          </select>
        </label>
      ) : <input name="profileId" type="hidden" value="" />}
      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? copy.composerSendingAction : copy.composerSendAction}
      </button>
    </form>
  );
}
