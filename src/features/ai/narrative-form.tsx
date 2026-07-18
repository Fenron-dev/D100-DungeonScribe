"use client";

import { useActionState } from "react";
import {
  initialNarrativeFormState,
  type NarrativeFormAction,
} from "@/features/ai/form-state";
import type { getMessages } from "@/i18n/messages";

export function NarrativeForm({
  action,
  messages,
  mode,
}: {
  action: NarrativeFormAction;
  messages: ReturnType<typeof getMessages>;
  mode: "openai" | "demo";
}) {
  const [state, formAction, isPending] = useActionState(action, initialNarrativeFormState);
  const copy = messages.scenes;
  const errorMessage = state.message === "validation"
    ? copy.validationMessage
    : state.message === "rate_limit"
      ? copy.aiRateLimitError
      : state.message === "credits"
        ? copy.aiCreditsError
        : state.message === "model_unavailable"
          ? copy.aiModelUnavailableError
          : state.message === "model_incompatible"
            ? copy.aiModelIncompatibleError
            : state.message === "provider_error"
              ? copy.aiProviderError
              : copy.aiNarrationError;
  return (
    <form className="scene-journal-form ai-narrative-form" action={formAction} noValidate>
      <div className="ai-form-heading">
        <h3>{copy.aiNarrationTitle}</h3>
        <span className={`provider-mode provider-${mode}`}>
          {mode === "openai" ? copy.aiOpenAiMode : copy.aiDemoMode}
        </span>
      </div>
      <p>{copy.aiNarrationDescription}</p>
      {mode === "demo" ? <p className="form-hint">{copy.aiDemoHint}</p> : null}
      {state.message ? (
        <div className="form-message" role="alert">
          <p>{errorMessage}</p>
        </div>
      ) : null}
      <div className="form-field">
        <label htmlFor="ai-narration-direction">{copy.aiDirectionLabel}</label>
        <textarea
          id="ai-narration-direction"
          name="direction"
          rows={4}
          maxLength={2_000}
          required
        />
      </div>
      <button className="button" type="submit" disabled={isPending}>
        {isPending ? copy.aiGeneratingAction : copy.aiGenerateAction}
      </button>
    </form>
  );
}
