"use client";

import { useActionState } from "react";
import type { CharacterDraft } from "@/domain/character";
import type { CharacterFormAction } from "@/features/characters/form-state";
import { initialCharacterFormState } from "@/features/characters/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface CharacterFormProps {
  action: CharacterFormAction;
  character?: CharacterDraft;
  messages: Messages;
  mode: "create" | "edit";
}

function ErrorList({ errors }: { errors: string[] }) {
  return errors.length > 0 ? (
    <ul className="field-errors">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  ) : null;
}

export function CharacterForm({
  action,
  character,
  messages,
  mode,
}: CharacterFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialCharacterFormState,
  );
  const copy = messages.characters;
  const isEdit = mode === "edit";

  return (
    <form className="campaign-form character-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation"
            ? copy.validationMessage
            : copy.saveError}
        </p>
      ) : null}

      <div className="form-field">
        <label htmlFor="character-name">{copy.nameLabel}</label>
        <input
          id="character-name"
          name="name"
          type="text"
          defaultValue={character?.name ?? ""}
          maxLength={100}
          aria-invalid={state.errors.name.length > 0}
          required
        />
        <ErrorList errors={state.errors.name} />
      </div>

      <div className="form-field">
        <label htmlFor="character-concept">{copy.conceptLabel}</label>
        <textarea
          id="character-concept"
          name="concept"
          defaultValue={character?.concept ?? ""}
          maxLength={500}
          rows={4}
          aria-invalid={state.errors.concept.length > 0}
          required
        />
        <ErrorList errors={state.errors.concept} />
      </div>

      <div className="form-field">
        <label htmlFor="character-archetype">{copy.archetypeLabel}</label>
        <select
          id="character-archetype"
          name="archetype"
          defaultValue={character?.archetype ?? ""}
          aria-invalid={state.errors.archetype.length > 0}
          required
        >
          <option value="" disabled>
            {copy.archetypePlaceholder}
          </option>
          <option value="powerful">{copy.archetypes.powerful}</option>
          <option value="agile">{copy.archetypes.agile}</option>
          <option value="insightful">{copy.archetypes.insightful}</option>
        </select>
        <ErrorList errors={state.errors.archetype} />
      </div>

      <fieldset className="trait-fields">
        <legend>{copy.traitsLabel}</legend>
        <p>{copy.traitsHint}</p>
        {[0, 1, 2].map((index) => (
          <div className="form-field" key={index}>
            <label htmlFor={`character-trait-${index + 1}`}>
              {copy.traitLabel} {index + 1}
              {index > 0 ? <span> ({copy.optionalHint})</span> : null}
            </label>
            <input
              id={`character-trait-${index + 1}`}
              name="traits"
              type="text"
              defaultValue={character?.traits[index] ?? ""}
              maxLength={60}
              aria-invalid={state.errors.traits.length > 0}
              required={index === 0}
            />
          </div>
        ))}
        <ErrorList errors={state.errors.traits} />
      </fieldset>

      <div className="form-field">
        <label htmlFor="character-flaw">
          {copy.flawLabel} <span>({copy.optionalHint})</span>
        </label>
        <input
          id="character-flaw"
          name="flaw"
          type="text"
          defaultValue={character?.flaw ?? ""}
          maxLength={120}
          aria-invalid={state.errors.flaw.length > 0}
        />
        <ErrorList errors={state.errors.flaw} />
      </div>

      <div className="form-field">
        <label htmlFor="character-notes">
          {copy.notesLabel} <span>({copy.optionalHint})</span>
        </label>
        <textarea
          id="character-notes"
          name="notes"
          defaultValue={character?.notes ?? ""}
          maxLength={4_000}
          rows={5}
          aria-invalid={state.errors.notes.length > 0}
        />
        <ErrorList errors={state.errors.notes} />
      </div>

      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending
          ? isEdit
            ? copy.savingAction
            : copy.creatingAction
          : isEdit
            ? copy.editAction
            : copy.createAction}
      </button>
    </form>
  );
}
