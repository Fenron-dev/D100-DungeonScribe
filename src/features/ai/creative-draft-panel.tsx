"use client";

import { useActionState, useId, type ReactNode } from "react";
import type { CreativeDraftActionResult } from "@/features/ai/creative-draft-actions";
import type { getMessages } from "@/i18n/messages";

export type CreativeDraftAction<T> = (
  state: CreativeDraftActionResult<T>,
  formData: FormData,
) => Promise<CreativeDraftActionResult<T>>;

function initialState<T>(): CreativeDraftActionResult<T> {
  return { draft: null, error: false, revision: 0 };
}

export function CreativeDraftPanel<T>({
  action,
  messages,
  mode,
  renderForm,
}: {
  action: CreativeDraftAction<T>;
  messages: ReturnType<typeof getMessages>;
  mode: "openai" | "demo";
  renderForm: (draft: T | null, revision: number) => ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState<T>());
  const fieldId = useId();
  const copy = messages.creativeDrafts;

  return (
    <>
      <form className="creative-draft-panel" action={formAction} aria-labelledby={`${fieldId}-title`}>
        <div className="ai-form-heading">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id={`${fieldId}-title`}>{copy.title}</h2>
          </div>
          <span className={`provider-mode provider-${mode}`}>
            {mode === "openai" ? copy.openAiMode : copy.demoMode}
          </span>
        </div>
        <p>{copy.description}</p>
        {mode === "demo" ? <p className="form-hint">{copy.demoHint}</p> : null}
        {state.error ? <p className="form-message" role="alert">{copy.error}</p> : null}
        <div className="form-field">
          <label htmlFor={fieldId}>{copy.preferenceLabel}</label>
          <textarea
            id={fieldId}
            name="preference"
            maxLength={500}
            rows={3}
            placeholder={copy.preferencePlaceholder}
          />
          <p className="field-hint">{copy.preferenceHint}</p>
        </div>
        <button className="button button-secondary" type="submit" disabled={isPending}>
          {isPending
            ? copy.generatingAction
            : state.draft
              ? copy.regenerateAction
              : copy.generateAction}
        </button>
        {state.draft ? (
          <p className="draft-review-hint" role="status">{copy.reviewHint}</p>
        ) : null}
      </form>
      {renderForm(state.draft, state.revision)}
    </>
  );
}
