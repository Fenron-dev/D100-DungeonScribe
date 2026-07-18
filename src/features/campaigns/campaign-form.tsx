"use client";

import { useActionState, useState } from "react";
import type { CampaignDraft } from "@/domain/campaign";
import {
  campaignStyleTemplates,
  campaignTemplateIds,
  defaultCampaignStyle,
  type CampaignStyle,
  type CampaignTemplateId,
} from "@/domain/campaign-style";
import type { CampaignFormAction } from "@/features/campaigns/form-state";
import { initialCampaignFormState } from "@/features/campaigns/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;
type StyleKey = keyof CampaignStyle;

const primaryStyleKeys: readonly StyleKey[] = [
  "seriousness",
  "groundedness",
  "action",
  "combat",
  "danger",
  "lootAmount",
  "lootSignificance",
];

const detailedStyleKeys: readonly StyleKey[] = [
  "sliceOfLife",
  "rulesDensity",
];

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
  const [templateId, setTemplateId] = useState<CampaignTemplateId>(
    campaign?.templateId ?? "balanced",
  );
  const [style, setStyle] = useState<CampaignStyle>(
    campaign?.style ?? defaultCampaignStyle,
  );

  function applyTemplate(nextTemplateId: CampaignTemplateId): void {
    setTemplateId(nextTemplateId);
    setStyle({ ...campaignStyleTemplates[nextTemplateId] });
  }

  function changeStyle(key: StyleKey, value: number): void {
    setStyle((current) => ({ ...current, [key]: value }));
  }

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

      <section className="campaign-setup" aria-labelledby="campaign-setup-title">
        <div>
          <h2 id="campaign-setup-title">{copy.setupTitle}</h2>
          <p>{copy.setupDescription}</p>
        </div>

        <div className="form-field">
          <label htmlFor="campaign-template">{copy.templateLabel}</label>
          <select
            id="campaign-template"
            name="templateId"
            value={templateId}
            onChange={(event) => {
              const nextTemplateId = campaignTemplateIds.find(
                (id) => id === event.target.value,
              );
              if (nextTemplateId) applyTemplate(nextTemplateId);
            }}
          >
            {campaignTemplateIds.map((id) => (
              <option key={id} value={id}>{copy.templates[id]}</option>
            ))}
          </select>
          <p className="field-hint">{copy.templateHint}</p>
          <ErrorList errors={state.errors.templateId} />
        </div>

        <div className="style-settings" aria-labelledby="campaign-style-title">
          <div>
            <h3 id="campaign-style-title">{copy.styleTitle}</h3>
            <p>{copy.styleDescription}</p>
          </div>
          {primaryStyleKeys.map((key) => (
            <StyleSlider
              key={key}
              axis={copy.styleAxes[key]}
              name={key}
              value={style[key]}
              balancedValue={copy.balancedValue}
              onChange={(value) => changeStyle(key, value)}
            />
          ))}
          <details className="style-details">
            <summary>{copy.moreSettings}</summary>
            <div className="style-details-content">
              {detailedStyleKeys.map((key) => (
                <StyleSlider
                  key={key}
                  axis={copy.styleAxes[key]}
                  name={key}
                  value={style[key]}
                  balancedValue={copy.balancedValue}
                  onChange={(value) => changeStyle(key, value)}
                />
              ))}
            </div>
          </details>
          <ErrorList errors={state.errors.style} />
        </div>

        <div className="form-field">
          <label htmlFor="campaign-future-ideas">
            {copy.futureIdeasLabel} <span>({copy.optionalHint})</span>
          </label>
          <textarea
            id="campaign-future-ideas"
            name="futureIdeas"
            defaultValue={campaign?.futureIdeas ?? ""}
            maxLength={3_000}
            rows={5}
            placeholder={copy.futureIdeasPlaceholder}
          />
          <p className="field-hint">{copy.futureIdeasHint}</p>
          <ErrorList errors={state.errors.futureIdeas} />
        </div>
      </section>

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

function StyleSlider({
  axis,
  balancedValue,
  name,
  onChange,
  value,
}: {
  axis: { label: string; left: string; right: string };
  balancedValue: string;
  name: StyleKey;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className="style-slider">
      <div className="style-slider-heading">
        <label htmlFor={`campaign-style-${name}`}>{axis.label}</label>
        <output htmlFor={`campaign-style-${name}`}>{value} / 5</output>
      </div>
      <input
        id={`campaign-style-${name}`}
        name={name}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${value} / 5: ${value <= 2 ? axis.left : value >= 4 ? axis.right : balancedValue}`}
      />
      <div className="style-slider-labels" aria-hidden="true">
        <span>{axis.left}</span>
        <span>{axis.right}</span>
      </div>
    </div>
  );
}
