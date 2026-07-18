"use client";

import { useId, useState, useTransition } from "react";
import type { CreativeDraftActionResult } from "@/features/ai/creative-draft-actions";
import type { getMessages } from "@/i18n/messages";

export type CreativeDraftAction<T> = (
  preference: string,
) => Promise<CreativeDraftActionResult<T>>;

export function CreativeDraftPanel<T>({
  action,
  messages,
  mode,
  onDraft,
}: {
  action: CreativeDraftAction<T>;
  messages: ReturnType<typeof getMessages>;
  mode: "openai" | "demo";
  onDraft: (draft: T) => void;
}) {
  const [preference, setPreference] = useState("");
  const [error, setError] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fieldId = useId();
  const copy = messages.creativeDrafts;

  function generate(): void {
    setError(false);
    startTransition(async () => {
      const result = await action(preference);
      if (!result.draft || result.error) {
        setError(true);
        return;
      }
      onDraft(result.draft);
      setHasDraft(true);
    });
  }

  return (
    <section className="creative-draft-panel" aria-labelledby={`${fieldId}-title`}>
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
      {error ? (
        <p className="form-message" role="alert">{copy.error}</p>
      ) : null}
      <div className="form-field">
        <label htmlFor={fieldId}>{copy.preferenceLabel}</label>
        <textarea
          id={fieldId}
          value={preference}
          onChange={(event) => setPreference(event.target.value)}
          maxLength={500}
          rows={3}
          placeholder={copy.preferencePlaceholder}
        />
        <p className="field-hint">{copy.preferenceHint}</p>
      </div>
      <button
        className="button button-secondary"
        type="button"
        onClick={generate}
        disabled={isPending}
      >
        {isPending ? copy.generatingAction : hasDraft ? copy.regenerateAction : copy.generateAction}
      </button>
      {hasDraft ? (
        <p className="draft-review-hint" role="status">{copy.reviewHint}</p>
      ) : null}
    </section>
  );
}
