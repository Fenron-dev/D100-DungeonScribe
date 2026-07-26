"use client";

import { useActionState, useState } from "react";
import {
  campaignStyleTemplates,
  campaignTemplateIds,
  defaultCampaignStyle,
  type CampaignStyle,
  type CampaignTemplateId,
} from "@/domain/campaign-style";
import { StyleSlider } from "@/features/campaigns/campaign-form";
import type { StylePresetFormAction } from "@/features/library/style-preset-form-state";
import { initialStylePresetFormState } from "@/features/library/style-preset-form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;
type StyleKey = keyof CampaignStyle;

const styleKeys: readonly StyleKey[] = [
  "seriousness",
  "groundedness",
  "action",
  "combat",
  "sliceOfLife",
  "rulesDensity",
  "danger",
  "lootAmount",
  "lootSignificance",
];

export function CampaignStylePresetForm({
  action,
  messages,
}: {
  action: StylePresetFormAction;
  messages: Messages;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialStylePresetFormState,
  );
  const [baseTemplateId, setBaseTemplateId] =
    useState<CampaignTemplateId>("balanced");
  const [style, setStyle] = useState<CampaignStyle>(defaultCampaignStyle);
  const copy = messages.library;
  const campaignCopy = messages.campaigns;

  function applyTemplate(templateId: CampaignTemplateId): void {
    setBaseTemplateId(templateId);
    setStyle({ ...campaignStyleTemplates[templateId] });
  }

  return (
    <form action={formAction} className="style-preset-form" noValidate>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="style-preset-name">{copy.presetNameLabel}</label>
          <input id="style-preset-name" name="name" maxLength={80} required />
          <ErrorList errors={state.errors.name} />
        </div>
        <div className="form-field">
          <label htmlFor="style-preset-base">{copy.baseTemplateLabel}</label>
          <select
            id="style-preset-base"
            name="baseTemplateId"
            value={baseTemplateId}
            onChange={(event) => {
              const selected = campaignTemplateIds.find(
                (id) => id === event.target.value,
              );
              if (selected) applyTemplate(selected);
            }}
          >
            {campaignTemplateIds.map((id) => (
              <option key={id} value={id}>
                {campaignCopy.templates[id]}
              </option>
            ))}
          </select>
          <ErrorList errors={state.errors.baseTemplateId} />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="style-preset-description">
          {copy.presetDescriptionLabel} ({campaignCopy.optionalHint})
        </label>
        <textarea
          id="style-preset-description"
          name="description"
          maxLength={300}
          rows={2}
        />
        <ErrorList errors={state.errors.description} />
      </div>
      <div className="style-preset-sliders">
        {styleKeys.map((key) => (
          <StyleSlider
            key={key}
            axis={campaignCopy.styleAxes[key]}
            balancedValue={campaignCopy.balancedValue}
            name={key}
            value={style[key]}
            onChange={(value) =>
              setStyle((current) => ({ ...current, [key]: value }))
            }
          />
        ))}
      </div>
      <ErrorList errors={state.errors.style} />
      {state.message ? (
        <p className="form-message" role="status">
          {state.message === "saved"
            ? copy.presetSaved
            : state.message === "validation"
              ? copy.presetValidation
              : copy.presetSaveError}
        </p>
      ) : null}
      <button className="button button-primary" disabled={isPending} type="submit">
        {isPending ? copy.savingPresetAction : copy.savePresetAction}
      </button>
    </form>
  );
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
