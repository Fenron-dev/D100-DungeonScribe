"use client";

import { useActionState } from "react";
import type { StoryThreadDraft } from "@/domain/story-thread";
import type { WorldEntity } from "@/domain/world-entity";
import type { StoryThreadFormAction } from "@/features/story-threads/form-state";
import { initialStoryThreadFormState } from "@/features/story-threads/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface StoryThreadFormProps {
  action: StoryThreadFormAction;
  entities: WorldEntity[];
  messages: Messages;
  mode: "create" | "edit";
  thread?: StoryThreadDraft;
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

export function StoryThreadForm({
  action,
  entities,
  messages,
  mode,
  thread,
}: StoryThreadFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialStoryThreadFormState,
  );
  const copy = messages.storyThreads;
  const isEdit = mode === "edit";

  return (
    <form className="campaign-form thread-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation" ? copy.validationMessage : copy.saveError}
        </p>
      ) : null}

      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="thread-title">{copy.titleLabel}</label>
          <input
            id="thread-title"
            name="title"
            type="text"
            defaultValue={thread?.title ?? ""}
            maxLength={160}
            aria-invalid={state.errors.title.length > 0}
            required
          />
          <ErrorList errors={state.errors.title} />
        </div>
        <div className="form-field">
          <label htmlFor="thread-status">{copy.statusLabel}</label>
          <select
            id="thread-status"
            name="status"
            defaultValue={thread?.status ?? "open"}
            aria-invalid={state.errors.status.length > 0}
          >
            <option value="open">{copy.statuses.open}</option>
            <option value="dormant">{copy.statuses.dormant}</option>
            <option value="resolved">{copy.statuses.resolved}</option>
            <option value="failed">{copy.statuses.failed}</option>
          </select>
          <ErrorList errors={state.errors.status} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="thread-premise">{copy.premiseLabel}</label>
        <textarea
          id="thread-premise"
          name="premise"
          defaultValue={thread?.premise ?? ""}
          maxLength={800}
          rows={4}
          aria-invalid={state.errors.premise.length > 0}
          required
        />
        <ErrorList errors={state.errors.premise} />
      </div>

      <div className="form-field">
        <label htmlFor="thread-description">
          {copy.descriptionLabel} <span>({copy.optionalHint})</span>
        </label>
        <textarea
          id="thread-description"
          name="description"
          defaultValue={thread?.description ?? ""}
          maxLength={4_000}
          rows={6}
          aria-invalid={state.errors.description.length > 0}
        />
        <ErrorList errors={state.errors.description} />
      </div>

      <fieldset className="selection-fieldset">
        <legend>{copy.progressTitle}</legend>
        <div className="thread-progress-fields">
          <div className="form-field">
            <label htmlFor="thread-urgency">{copy.urgencyLabel}</label>
            <select
              id="thread-urgency"
              name="urgency"
              defaultValue={String(thread?.urgency ?? 3)}
              aria-invalid={state.errors.urgency.length > 0}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option value={value} key={value}>{value}</option>
              ))}
            </select>
            <p className="field-hint">{copy.urgencyHint}</p>
            <ErrorList errors={state.errors.urgency} />
          </div>
          <div className="form-field">
            <label htmlFor="thread-progress-current">{copy.progressCurrentLabel}</label>
            <input
              id="thread-progress-current"
              name="progressCurrent"
              type="number"
              defaultValue={thread?.progressCurrent ?? 0}
              min={0}
              max={12}
              aria-invalid={state.errors.progressCurrent.length > 0}
            />
            <ErrorList errors={state.errors.progressCurrent} />
          </div>
          <div className="form-field">
            <label htmlFor="thread-progress-target">{copy.progressTargetLabel}</label>
            <input
              id="thread-progress-target"
              name="progressTarget"
              type="number"
              defaultValue={thread?.progressTarget ?? 4}
              min={1}
              max={12}
              aria-invalid={state.errors.progressTarget.length > 0}
            />
            <ErrorList errors={state.errors.progressTarget} />
          </div>
        </div>
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
                  defaultChecked={thread?.relatedEntityIds.includes(entity.id)}
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

      <fieldset className="selection-fieldset">
        <legend>{copy.developmentsLabel}</legend>
        <p>{copy.developmentsHint}</p>
        <div className="development-fields">
          {[0, 1, 2, 3, 4].map((index) => (
            <div className="form-field" key={index}>
              <label htmlFor={`thread-development-${index + 1}`}>
                {copy.developmentLabel} {index + 1}
                {index > 0 ? <span> ({copy.optionalHint})</span> : null}
              </label>
              <input
                id={`thread-development-${index + 1}`}
                name="nextPossibleDevelopments"
                type="text"
                defaultValue={thread?.nextPossibleDevelopments[index] ?? ""}
                maxLength={240}
                required={index === 0}
              />
            </div>
          ))}
        </div>
        <ErrorList errors={state.errors.nextPossibleDevelopments} />
      </fieldset>

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
