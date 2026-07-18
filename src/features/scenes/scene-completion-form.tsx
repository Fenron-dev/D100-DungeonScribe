"use client";

import { useActionState } from "react";
import type { SceneCompletionAction } from "@/features/scenes/form-state";
import { initialSceneCompletionState } from "@/features/scenes/form-state";
import type { getMessages } from "@/i18n/messages";

export function SceneCompletionForm({
  action,
  messages,
}: {
  action: SceneCompletionAction;
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialSceneCompletionState,
  );
  const copy = messages.scenes;
  return (
    <form className="scene-completion" action={formAction} noValidate>
      <h2>{copy.completeTitle}</h2>
      <p>{copy.completeDescription}</p>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation" ? copy.validationMessage : copy.saveError}
        </p>
      ) : null}
      <div className="form-field">
        <label htmlFor="scene-summary">{copy.summaryLabel}</label>
        <textarea id="scene-summary" name="summary" rows={8} maxLength={8_000} required />
        <ErrorList errors={state.errors} />
      </div>
      <div className="form-field">
        <label htmlFor="tension-adjustment">{copy.tensionAdjustmentLabel}</label>
        <select id="tension-adjustment" name="tensionAdjustment" defaultValue="steady">
          <option value="decrease">{copy.tensionAdjustments.decrease}</option>
          <option value="steady">{copy.tensionAdjustments.steady}</option>
          <option value="increase">{copy.tensionAdjustments.increase}</option>
        </select>
        <small>{copy.tensionAdjustmentHint}</small>
      </div>
      <button className="button button-danger" type="submit" disabled={isPending}>
        {isPending ? copy.completingAction : copy.completeAction}
      </button>
    </form>
  );
}

function ErrorList({ errors }: { errors: string[] }) {
  return errors.length > 0 ? (
    <ul className="field-errors">
      {errors.map((error) => <li key={error}>{error}</li>)}
    </ul>
  ) : null;
}
