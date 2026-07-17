"use client";

import { useActionState } from "react";
import type { Character } from "@/domain/character";
import type { KnowledgeEntryDraft } from "@/domain/knowledge-entry";
import type { WorldEntity } from "@/domain/world-entity";
import type { KnowledgeEntryFormAction } from "@/features/knowledge/form-state";
import { initialKnowledgeEntryFormState } from "@/features/knowledge/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface KnowledgeEntryFormProps {
  action: KnowledgeEntryFormAction;
  characters: Character[];
  entities: WorldEntity[];
  entry?: KnowledgeEntryDraft;
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

export function KnowledgeEntryForm({
  action,
  characters,
  entities,
  entry,
  messages,
  mode,
}: KnowledgeEntryFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialKnowledgeEntryFormState,
  );
  const copy = messages.knowledge;
  const isEdit = mode === "edit";

  return (
    <form className="campaign-form knowledge-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation" ? copy.validationMessage : copy.saveError}
        </p>
      ) : null}

      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="knowledge-type">{copy.typeLabel}</label>
          <select
            id="knowledge-type"
            name="type"
            defaultValue={entry?.type ?? ""}
            aria-invalid={state.errors.type.length > 0}
            required
          >
            <option value="" disabled>{copy.typePlaceholder}</option>
            <option value="fact">{copy.types.fact}</option>
            <option value="character_knowledge">{copy.types.character_knowledge}</option>
            <option value="rumor">{copy.types.rumor}</option>
            <option value="secret">{copy.types.secret}</option>
            <option value="assumption">{copy.types.assumption}</option>
            <option value="memory">{copy.types.memory}</option>
          </select>
          <ErrorList errors={state.errors.type} />
        </div>

        <div className="form-field">
          <label htmlFor="knowledge-truth-status">{copy.truthStatusLabel}</label>
          <select
            id="knowledge-truth-status"
            name="truthStatus"
            defaultValue={entry?.truthStatus ?? "unknown"}
            aria-invalid={state.errors.truthStatus.length > 0}
          >
            <option value="true">{copy.truthStatuses.true}</option>
            <option value="false">{copy.truthStatuses.false}</option>
            <option value="partially_true">{copy.truthStatuses.partially_true}</option>
            <option value="unknown">{copy.truthStatuses.unknown}</option>
          </select>
          <ErrorList errors={state.errors.truthStatus} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="knowledge-title">{copy.titleLabel}</label>
        <input
          id="knowledge-title"
          name="title"
          type="text"
          defaultValue={entry?.title ?? ""}
          maxLength={160}
          aria-invalid={state.errors.title.length > 0}
          required
        />
        <ErrorList errors={state.errors.title} />
      </div>

      <div className="form-field">
        <label htmlFor="knowledge-content">{copy.contentLabel}</label>
        <textarea
          id="knowledge-content"
          name="content"
          defaultValue={entry?.content ?? ""}
          maxLength={8_000}
          rows={8}
          aria-invalid={state.errors.content.length > 0}
          required
        />
        <ErrorList errors={state.errors.content} />
      </div>

      <fieldset className="selection-fieldset">
        <legend>{copy.knownByLabel}</legend>
        <p>{copy.knownByHint}</p>
        {characters.length > 0 ? (
          <div className="checkbox-grid">
            {characters.map((character) => (
              <label className="checkbox-card" key={character.id}>
                <input
                  type="checkbox"
                  name="knownByCharacterIds"
                  value={character.id}
                  defaultChecked={entry?.knownByCharacterIds.includes(character.id)}
                />
                <span>{character.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="empty-inline">{copy.noCharacters}</p>
        )}
        <ErrorList errors={state.errors.knownByCharacterIds} />
      </fieldset>

      <fieldset className="selection-fieldset">
        <legend>{copy.relatedEntitiesLabel}</legend>
        <p>{copy.relatedEntitiesHint}</p>
        {entities.length > 0 ? (
          <div className="checkbox-grid">
            {entities.map((entity) => (
              <label className="checkbox-card" key={entity.id}>
                <input
                  type="checkbox"
                  name="relatedEntityIds"
                  value={entity.id}
                  defaultChecked={entry?.relatedEntityIds.includes(entity.id)}
                />
                <span>{entity.name} · {messages.worldEntities.types[entity.type]}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="empty-inline">{copy.noEntities}</p>
        )}
        <ErrorList errors={state.errors.relatedEntityIds} />
      </fieldset>

      <label className="lock-control">
        <input type="checkbox" name="locked" defaultChecked={entry?.locked} />
        <span>
          <strong>{copy.lockedLabel}</strong>
          <small>{copy.lockedHint}</small>
        </span>
      </label>
      <ErrorList errors={state.errors.locked} />

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
