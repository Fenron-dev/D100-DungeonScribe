"use client";

import { useActionState } from "react";
import type { CampaignDraft } from "@/domain/campaign";
import type { CampaignFormAction } from "@/features/campaigns/form-state";
import { initialCampaignFormState } from "@/features/campaigns/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface CampaignFormProps {
  action: CampaignFormAction;
  campaign?: CampaignDraft;
  messages: Messages;
  mode: "create" | "edit";
}

function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <ul className="field-errors">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}

export function CampaignForm({
  action,
  campaign,
  messages,
  mode,
}: CampaignFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialCampaignFormState,
  );
  const copy = messages.campaigns;
  const isEdit = mode === "edit";

  return (
    <form className="campaign-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation"
            ? copy.validationMessage
            : copy.saveError}
        </p>
      ) : null}

      <div className="form-field">
        <label htmlFor="campaign-name">{copy.nameLabel}</label>
        <input
          id="campaign-name"
          name="name"
          type="text"
          defaultValue={campaign?.name ?? ""}
          maxLength={100}
          aria-invalid={state.errors.name.length > 0}
          aria-describedby="campaign-name-errors"
          required
        />
        <div id="campaign-name-errors">
          <ErrorList errors={state.errors.name} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="campaign-premise">{copy.premiseLabel}</label>
        <textarea
          id="campaign-premise"
          name="premise"
          defaultValue={campaign?.premise ?? ""}
          maxLength={2_000}
          rows={7}
          aria-invalid={state.errors.premise.length > 0}
          aria-describedby="campaign-premise-errors"
          required
        />
        <div id="campaign-premise-errors">
          <ErrorList errors={state.errors.premise} />
        </div>
      </div>

      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="campaign-genre">
            {copy.genreLabel} <span>({copy.optionalHint})</span>
          </label>
          <input
            id="campaign-genre"
            name="genre"
            type="text"
            defaultValue={campaign?.genre ?? ""}
            maxLength={60}
            aria-invalid={state.errors.genre.length > 0}
            aria-describedby="campaign-genre-errors"
          />
          <div id="campaign-genre-errors">
            <ErrorList errors={state.errors.genre} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="campaign-mood">
            {copy.moodLabel} <span>({copy.optionalHint})</span>
          </label>
          <input
            id="campaign-mood"
            name="mood"
            type="text"
            defaultValue={campaign?.mood ?? ""}
            maxLength={60}
            aria-invalid={state.errors.mood.length > 0}
            aria-describedby="campaign-mood-errors"
          />
          <div id="campaign-mood-errors">
            <ErrorList errors={state.errors.mood} />
          </div>
        </div>
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
