"use client";

import { useActionState } from "react";
import {
  initialOracleFormState,
  type OracleFormAction,
} from "@/features/oracle/form-state";
import type { getMessages } from "@/i18n/messages";

export function OracleForm({
  action,
  messages,
}: {
  action: OracleFormAction;
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialOracleFormState);
  const copy = messages.oracle;
  return (
    <form className="scene-journal-form oracle-form" action={formAction} noValidate>
      <h3>{copy.formTitle}</h3>
      <p>{copy.formDescription}</p>
      {state.message ? (
        <div className="form-message" role="alert">
          <p>{state.message === "validation" ? copy.validationMessage : copy.saveError}</p>
          {state.errors.length > 0 ? (
            <ul>{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>
          ) : null}
        </div>
      ) : null}
      <div className="form-field">
        <label htmlFor="oracle-question">{copy.questionLabel}</label>
        <input id="oracle-question" name="question" maxLength={500} required />
      </div>
      <div className="form-field">
        <label htmlFor="oracle-likelihood">{copy.likelihoodLabel}</label>
        <select id="oracle-likelihood" name="likelihood" defaultValue="even">
          <option value="nearly_impossible">{copy.likelihoods.nearly_impossible}</option>
          <option value="unlikely">{copy.likelihoods.unlikely}</option>
          <option value="even">{copy.likelihoods.even}</option>
          <option value="likely">{copy.likelihoods.likely}</option>
          <option value="nearly_certain">{copy.likelihoods.nearly_certain}</option>
        </select>
      </div>
      <button className="button" type="submit" disabled={isPending}>
        {isPending ? copy.askingAction : copy.askAction}
      </button>
    </form>
  );
}

export function InspirationForm({
  action,
  messages,
}: {
  action: OracleFormAction;
  messages: ReturnType<typeof getMessages>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialOracleFormState);
  const copy = messages.oracle;
  const categoryOptions = Object.entries(copy.categories);
  return (
    <form className="scene-journal-form oracle-form" action={formAction} noValidate>
      <h3>{copy.inspirationTitle}</h3>
      <p>{copy.inspirationDescription}</p>
      {state.message ? (
        <div className="form-message" role="alert">
          <p>{state.message === "validation" ? copy.validationMessage : copy.saveError}</p>
          {state.errors.length > 0 ? (
            <ul>{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>
          ) : null}
        </div>
      ) : null}
      <div className="form-field">
        <label htmlFor="inspiration-question">{copy.detailQuestionLabel}</label>
        <input id="inspiration-question" name="question" maxLength={500} />
        <small>{copy.detailQuestionHint}</small>
      </div>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="inspiration-primary">{copy.primaryCategoryLabel}</label>
          <select id="inspiration-primary" name="primaryCategory" defaultValue="action">
            {categoryOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="inspiration-secondary">{copy.secondaryCategoryLabel}</label>
          <select id="inspiration-secondary" name="secondaryCategory" defaultValue="theme">
            {categoryOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      <button className="button" type="submit" disabled={isPending}>
        {isPending ? copy.drawingAction : copy.drawAction}
      </button>
    </form>
  );
}
