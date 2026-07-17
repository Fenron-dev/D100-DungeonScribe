"use client";

import { useActionState } from "react";
import type { WorldEntity } from "@/domain/world-entity";
import type { RelationFormAction } from "@/features/world-entities/relation-form-state";
import { initialRelationFormState } from "@/features/world-entities/relation-form-state";
import type { getMessages } from "@/i18n/messages";

interface RelationFormProps {
  action: RelationFormAction;
  entities: WorldEntity[];
  messages: ReturnType<typeof getMessages>;
}

export function RelationForm({ action, entities, messages }: RelationFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialRelationFormState,
  );
  const copy = messages.worldEntities;
  return (
    <form className="relation-form" action={formAction} noValidate>
      {state.message ? (
        <p className="form-message" role="alert">
          {state.message === "validation"
            ? copy.relationValidationMessage
            : copy.relationSaveError}
        </p>
      ) : null}
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="relation-target">{copy.relationTargetLabel}</label>
          <select id="relation-target" name="targetEntityId" required>
            <option value="">{copy.relationTargetPlaceholder}</option>
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name} ({copy.types[entity.type]})
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="relation-type">{copy.relationTypeLabel}</label>
          <select id="relation-type" name="relationType" required defaultValue="connected_to">
            {Object.entries(copy.relationTypes).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-columns">
        <div className="form-field">
          <label htmlFor="relation-description">
            {copy.relationDescriptionLabel} <span>({copy.optionalHint})</span>
          </label>
          <input id="relation-description" name="relationDescription" maxLength={500} />
        </div>
        <div className="form-field">
          <label htmlFor="relation-status">{copy.relationStatusLabel}</label>
          <select id="relation-status" name="relationStatus" defaultValue="active">
            <option value="active">{copy.relationStatuses.active}</option>
            <option value="inactive">{copy.relationStatuses.inactive}</option>
          </select>
        </div>
      </div>
      <button className="button button-secondary" disabled={isPending} type="submit">
        {isPending ? copy.relationCreatingAction : copy.relationCreateAction}
      </button>
    </form>
  );
}
