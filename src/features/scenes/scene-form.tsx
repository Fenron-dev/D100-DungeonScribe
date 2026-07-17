"use client";

import { useActionState } from "react";
import type { Character } from "@/domain/character";
import type { StoryThread } from "@/domain/story-thread";
import type { WorldEntity } from "@/domain/world-entity";
import type { SceneFormAction } from "@/features/scenes/form-state";
import { initialSceneFormState } from "@/features/scenes/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface SceneFormProps {
  action: SceneFormAction;
  characters: Character[];
  entities: WorldEntity[];
  messages: Messages;
  threads: StoryThread[];
}

function ErrorList({ errors }: { errors: string[] }) {
  return errors.length > 0 ? (
    <ul className="field-errors">
      {errors.map((error) => <li key={error}>{error}</li>)}
    </ul>
  ) : null;
}

export function SceneForm({
  action,
  characters,
  entities,
  messages,
  threads,
}: SceneFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialSceneFormState,
  );
  const copy = messages.scenes;
  const locations = entities.filter((entity) => entity.type === "location");

  return (
    <form className="campaign-form scene-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation"
            ? copy.validationMessage
            : state.message === "active_exists"
              ? copy.activeExistsError
              : copy.saveError}
        </p>
      ) : null}

      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="scene-title">{copy.titleLabel}</label>
          <input id="scene-title" name="title" type="text" maxLength={160} required />
          <ErrorList errors={state.errors.title} />
        </div>
        <div className="form-field">
          <label htmlFor="scene-location">{copy.locationLabel}</label>
          <select id="scene-location" name="locationId" defaultValue="">
            <option value="">{copy.noLocation}</option>
            {locations.map((location) => (
              <option value={location.id} key={location.id}>{location.name}</option>
            ))}
          </select>
          <ErrorList errors={state.errors.locationId} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="scene-expected">{copy.expectedSetupLabel}</label>
        <textarea id="scene-expected" name="expectedSetup" rows={5} maxLength={2_000} required />
        <ErrorList errors={state.errors.expectedSetup} />
      </div>
      <div className="form-field">
        <label htmlFor="scene-actual">{copy.actualSetupLabel}</label>
        <textarea id="scene-actual" name="actualSetup" rows={5} maxLength={2_000} required />
        <p className="field-hint">{copy.actualSetupHint}</p>
        <ErrorList errors={state.errors.actualSetup} />
      </div>
      <div className="form-field">
        <label htmlFor="scene-objective">{copy.objectiveLabel} <span>({copy.optionalHint})</span></label>
        <input id="scene-objective" name="objective" type="text" maxLength={500} />
        <ErrorList errors={state.errors.objective} />
      </div>

      <SelectionFieldset
        emptyText={copy.noCharacters}
        errors={state.errors.participantCharacterIds}
        hint={copy.charactersHint}
        label={copy.charactersLabel}
        name="participantCharacterIds"
        options={characters.map((character) => ({ id: character.id, label: character.name }))}
      />
      <SelectionFieldset
        emptyText={copy.noEntities}
        errors={state.errors.participantEntityIds}
        hint={copy.entitiesHint}
        label={copy.entitiesLabel}
        name="participantEntityIds"
        options={entities.map((entity) => ({
          id: entity.id,
          label: `${entity.name} · ${messages.worldEntities.types[entity.type]}`,
        }))}
      />
      <SelectionFieldset
        emptyText={copy.noThreads}
        errors={state.errors.relevantThreadIds}
        hint={copy.threadsHint}
        label={copy.threadsLabel}
        name="relevantThreadIds"
        options={threads.map((thread) => ({ id: thread.id, label: thread.title }))}
      />

      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? copy.startingAction : copy.startAction}
      </button>
    </form>
  );
}

function SelectionFieldset({
  emptyText,
  errors,
  hint,
  label,
  name,
  options,
}: {
  emptyText: string;
  errors: string[];
  hint: string;
  label: string;
  name: string;
  options: Array<{ id: string; label: string }>;
}) {
  return (
    <fieldset className="selection-fieldset">
      <legend>{label}</legend>
      <p>{hint}</p>
      {options.length > 0 ? (
        <div className="checkbox-grid">
          {options.map((option) => (
            <label className="checkbox-card" key={option.id}>
              <input type="checkbox" name={name} value={option.id} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="empty-inline">{emptyText}</p>
      )}
      <ErrorList errors={errors} />
    </fieldset>
  );
}
