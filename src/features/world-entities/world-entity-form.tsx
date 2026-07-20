"use client";

import { useActionState, useState } from "react";
import type { WorldEntityDraft, WorldEntityType } from "@/domain/world-entity";
import type { WorldEntityFormAction } from "@/features/world-entities/form-state";
import { initialWorldEntityFormState } from "@/features/world-entities/form-state";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface WorldEntityFormProps {
  action: WorldEntityFormAction;
  entity?: WorldEntityDraft;
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

export function WorldEntityForm({
  action,
  entity,
  messages,
  mode,
}: WorldEntityFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialWorldEntityFormState,
  );
  const copy = messages.worldEntities;
  const isEdit = mode === "edit";
  const [selectedType, setSelectedType] = useState<WorldEntityType | "">(
    entity?.type ?? "",
  );

  return (
    <form className="campaign-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation"
            ? copy.validationMessage
            : copy.saveError}
        </p>
      ) : null}

      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="world-entity-type">{copy.typeLabel}</label>
          <select
            id="world-entity-type"
            name="type"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(parseWorldEntityType(event.target.value))
            }
            aria-invalid={state.errors.type.length > 0}
            required
          >
            <option value="" disabled>{copy.typePlaceholder}</option>
            <option value="npc">{copy.types.npc}</option>
            <option value="location">{copy.types.location}</option>
            <option value="faction">{copy.types.faction}</option>
            <option value="item">{copy.types.item}</option>
          </select>
          <ErrorList errors={state.errors.type} />
        </div>

        <div className="form-field">
          <label htmlFor="world-entity-status">{copy.statusLabel}</label>
          <select
            id="world-entity-status"
            name="status"
            defaultValue={entity?.status ?? "active"}
            aria-invalid={state.errors.status.length > 0}
          >
            <option value="active">{copy.statuses.active}</option>
            <option value="inactive">{copy.statuses.inactive}</option>
            <option value="destroyed">{copy.statuses.destroyed}</option>
            <option value="unknown">{copy.statuses.unknown}</option>
          </select>
          <ErrorList errors={state.errors.status} />
        </div>
      </div>

      {(["npc", "location", "faction", "item"] as const)
        .filter((type) => type === selectedType)
        .map((type) => {
          const values = getDetailValues(entity, type);
          const names = detailFieldNames[type];
          return (
            <fieldset className="entity-details-fields" key={type}>
              <legend>{copy.detailsTitle}</legend>
              <p className="field-hint">{copy.detailsHint}</p>
              <div className="form-columns">
                <div className="form-field">
                  <label htmlFor={`world-entity-${names.primary}`}>
                    {copy.detailFields[type].primary}{" "}
                    <span>({copy.optionalHint})</span>
                  </label>
                  <input
                    id={`world-entity-${names.primary}`}
                    name={names.primary}
                    type="text"
                    defaultValue={values.primary}
                    maxLength={200}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor={`world-entity-${names.secondary}`}>
                    {copy.detailFields[type].secondary}{" "}
                    <span>({copy.optionalHint})</span>
                  </label>
                  <input
                    id={`world-entity-${names.secondary}`}
                    name={names.secondary}
                    type="text"
                    defaultValue={values.secondary}
                    maxLength={200}
                  />
                </div>
              </div>
              <ErrorList errors={state.errors.details} />
            </fieldset>
          );
        })}

      <div className="form-field">
        <label htmlFor="world-entity-name">{copy.nameLabel}</label>
        <input
          id="world-entity-name"
          name="name"
          type="text"
          defaultValue={entity?.name ?? ""}
          maxLength={120}
          aria-invalid={state.errors.name.length > 0}
          required
        />
        <ErrorList errors={state.errors.name} />
      </div>

      <div className="form-field">
        <label htmlFor="world-entity-summary">{copy.summaryLabel}</label>
        <textarea
          id="world-entity-summary"
          name="summary"
          defaultValue={entity?.summary ?? ""}
          maxLength={300}
          rows={3}
          aria-invalid={state.errors.summary.length > 0}
          required
        />
        <ErrorList errors={state.errors.summary} />
      </div>

      <div className="form-field">
        <label htmlFor="world-entity-description">
          {copy.descriptionLabel} <span>({copy.optionalHint})</span>
        </label>
        <textarea
          id="world-entity-description"
          name="description"
          defaultValue={entity?.description ?? ""}
          maxLength={4_000}
          rows={7}
          aria-invalid={state.errors.description.length > 0}
        />
        <ErrorList errors={state.errors.description} />
      </div>

      <div className="form-field">
        <label htmlFor="world-entity-tags">
          {copy.tagsLabel} <span>({copy.optionalHint})</span>
        </label>
        <input
          id="world-entity-tags"
          name="tags"
          type="text"
          defaultValue={entity?.tags.join(", ") ?? ""}
          maxLength={320}
          aria-invalid={state.errors.tags.length > 0}
        />
        <p className="field-hint">{copy.tagsHint}</p>
        <ErrorList errors={state.errors.tags} />
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

const detailFieldNames = {
  npc: { primary: "npcRole", secondary: "npcMotivation" },
  location: { primary: "locationRegion", secondary: "locationAtmosphere" },
  faction: { primary: "factionGoal", secondary: "factionInfluence" },
  item: { primary: "itemPurpose", secondary: "itemRarity" },
} as const;

function parseWorldEntityType(value: string): WorldEntityType | "" {
  switch (value) {
    case "npc":
    case "location":
    case "faction":
    case "item":
      return value;
    default:
      return "";
  }
}

function getDetailValues(entity: WorldEntityDraft | undefined, type: WorldEntityType): {
  primary: string;
  secondary: string;
} {
  if (!entity || entity.details.type !== type) return { primary: "", secondary: "" };
  switch (entity.details.type) {
    case "npc":
      return { primary: entity.details.role ?? "", secondary: entity.details.motivation ?? "" };
    case "location":
      return { primary: entity.details.region ?? "", secondary: entity.details.atmosphere ?? "" };
    case "faction":
      return { primary: entity.details.goal ?? "", secondary: entity.details.influence ?? "" };
    case "item":
      return { primary: entity.details.purpose ?? "", secondary: entity.details.rarity ?? "" };
  }
}
