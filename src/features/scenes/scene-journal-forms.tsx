"use client";

import { useActionState } from "react";
import type { Character } from "@/domain/character";
import {
  initialSceneJournalFormState,
  type SceneJournalFormAction,
} from "@/features/scenes/form-state";
import type { getMessages } from "@/i18n/messages";

function FormMessage({
  message,
  errors,
  copy,
}: {
  message: "validation" | "save_error" | "trait_mismatch" | null;
  errors: string[];
  copy: ReturnType<typeof getMessages>["scenes"];
}) {
  if (!message) return null;
  const text =
    message === "validation"
      ? copy.validationMessage
      : message === "trait_mismatch"
        ? copy.traitMismatchError
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
