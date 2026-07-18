"use client";

import { useActionState, useState } from "react";
import type { Character } from "@/domain/character";
import {
  initialSceneJournalFormState,
  type SceneJournalFormAction,
  type SceneJournalFormState,
} from "@/features/scenes/form-state";
import type { getMessages } from "@/i18n/messages";

function FormMessage({
  message,
  errors,
  copy,
}: {
  message: SceneJournalFormState["message"];
  errors: string[];
  copy: ReturnType<typeof getMessages>["scenes"];
}) {
  if (!message) return null;
  const text =
    message === "validation"
      ? copy.validationMessage
      : message === "trait_mismatch"
        ? copy.traitMismatchError
        : message === "rate_limit"
          ? copy.aiRateLimitError
          : message === "credits"
            ? copy.aiCreditsError
            : message === "model_unavailable"
              ? copy.aiModelUnavailableError
              : message === "model_incompatible"
                ? copy.aiModelIncompatibleError
                : message === "provider_error"
                  ? copy.aiProviderError
                  : copy.journalSaveError;
  return (
    <div className="form-message" role="alert">
      <p>{text}</p>
      {errors.length > 0 ? <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
    </div>
  );
}

export function SceneNoteForm({
  action,
  messages,
}: {
  action: SceneJournalFormAction;
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialSceneJournalFormState);
  const copy = messages.scenes;
  return (
    <form className="scene-journal-form" action={formAction} noValidate>
      <h3>{copy.noteTitle}</h3>
      <FormMessage message={state.message} errors={state.errors} copy={copy} />
      <div className="form-field">
        <label htmlFor="scene-note-kind">{copy.noteKindLabel}</label>
        <select id="scene-note-kind" name="kind" defaultValue="action">
          <option value="action">{copy.noteKinds.action}</option>
          <option value="observation">{copy.noteKinds.observation}</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="scene-note-content">{copy.noteContentLabel}</label>
        <textarea id="scene-note-content" name="content" rows={4} maxLength={4_000} required />
      </div>
      <button className="button button-secondary" type="submit" disabled={isPending}>
        {isPending ? copy.savingNoteAction : copy.saveNoteAction}
      </button>
    </form>
  );
}

export function SceneMessageForm({
  action,
  messages,
}: {
  action: SceneJournalFormAction;
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialSceneJournalFormState);
  const [role, setRole] = useState<"player" | "narrator">("player");
  const copy = messages.scenes;
  return (
    <form className="scene-journal-form scene-message-form" action={formAction} noValidate>
      <h3>{copy.messageTitle}</h3>
      <p>{copy.messageDescription}</p>
      <FormMessage message={state.message} errors={state.errors} copy={copy} />
      <div className="form-field">
        <label htmlFor="scene-message-role">{copy.messageRoleLabel}</label>
        <select
          id="scene-message-role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value === "narrator" ? "narrator" : "player")}
        >
          <option value="player">{copy.messageRoles.player}</option>
          <option value="narrator">{copy.messageRoles.narrator}</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="scene-message-content">{copy.messageContentLabel}</label>
        <textarea
          id="scene-message-content"
          name="content"
          rows={5}
          maxLength={8_000}
          required
        />
      </div>
      <div className="button-row">
        <button className="button button-secondary" name="submitMode" value="save" type="submit" disabled={isPending}>
          {isPending ? copy.sendingMessageAction : copy.sendMessageAction}
        </button>
        <button
          className="button"
          name="submitMode"
          value="ask-game-master"
          type="submit"
          disabled={isPending || role !== "player"}
        >
          {isPending ? copy.askingGameMasterAction : copy.askGameMasterAction}
        </button>
      </div>
    </form>
  );
}

export function SceneEntryEditForm({
  action,
  content,
  entryId,
  maxLength,
  messages,
}: {
  action: SceneJournalFormAction;
  content: string;
  entryId: string;
  maxLength: number;
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialSceneJournalFormState);
  const copy = messages.scenes;
  return (
    <details className="journal-entry-edit">
      <summary>{copy.editEntryAction}</summary>
      <form action={formAction} noValidate>
        <FormMessage message={state.message} errors={state.errors} copy={copy} />
        <div className="form-field">
          <label htmlFor={`journal-entry-content-${entryId}`}>{copy.editEntryLabel}</label>
          <textarea
            id={`journal-entry-content-${entryId}`}
            name="content"
            rows={5}
            maxLength={maxLength}
            defaultValue={content}
            required
          />
        </div>
        <button className="button button-secondary" type="submit" disabled={isPending}>
          {isPending ? copy.savingEntryAction : copy.saveEntryAction}
        </button>
      </form>
    </details>
  );
}

export function SceneRollForm({
  action,
  characters,
  messages,
}: {
  action: SceneJournalFormAction;
  characters: Character[];
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialSceneJournalFormState);
  const copy = messages.scenes;
  return (
    <form className="scene-journal-form" action={formAction} noValidate>
      <h3>{copy.rollTitle}</h3>
      <p>{copy.rollDescription}</p>
      <FormMessage message={state.message} errors={state.errors} copy={copy} />
      <div className="form-field">
        <label htmlFor="roll-character">{copy.rollCharacterLabel}</label>
        <select id="roll-character" name="characterId" defaultValue="" required>
          <option value="" disabled>{copy.rollCharacterPlaceholder}</option>
          {characters.map((character) => (
            <option key={character.id} value={character.id}>{character.name}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="roll-action">{copy.rollActionLabel}</label>
        <textarea id="roll-action" name="action" rows={3} maxLength={500} required />
      </div>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="roll-difficulty">{copy.difficultyLabel}</label>
          <select id="roll-difficulty" name="difficulty" defaultValue="normal">
            <option value="easy">{copy.difficulties.easy}</option>
            <option value="normal">{copy.difficulties.normal}</option>
            <option value="hard">{copy.difficulties.hard}</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="roll-trait">{copy.matchingTraitLabel}</label>
          <input id="roll-trait" name="matchingTrait" maxLength={120} list="scene-character-traits" />
          <datalist id="scene-character-traits">
            {characters.flatMap((character) =>
              character.traits.map((trait) => <option key={`${character.id}-${trait}`} value={trait} />),
            )}
          </datalist>
        </div>
      </div>
      <label className="checkbox-card" htmlFor="roll-archetype">
        <input id="roll-archetype" name="archetypeMatches" type="checkbox" />
        <span><strong>{copy.archetypeMatchesLabel}</strong><small>{copy.archetypeMatchesHint}</small></span>
      </label>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="roll-advantage">{copy.advantageLabel}</label>
          <input id="roll-advantage" name="advantage" maxLength={120} />
        </div>
        <div className="form-field">
          <label htmlFor="roll-disadvantage">{copy.disadvantageLabel}</label>
          <input id="roll-disadvantage" name="disadvantage" maxLength={120} />
        </div>
      </div>
      <button className="button" type="submit" disabled={isPending || characters.length === 0}>
        {isPending ? copy.rollingAction : copy.rollAction}
      </button>
    </form>
  );
}
