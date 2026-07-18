"use client";

import { useId, useMemo, useState } from "react";
import type { AiModelOption } from "@/ai/model-catalog";
import type { MessageCatalog } from "@/i18n/messages";

export function OpenRouterModelField({
  defaultValue,
  copy,
  id,
  models,
  name = "model",
}: {
  defaultValue: string;
  copy: MessageCatalog["aiSettings"];
  id: string;
  models: AiModelOption[];
  name?: string;
}) {
  const [freeOnly, setFreeOnly] = useState(true);
  const generatedId = useId();
  const listId = `${id}-${generatedId.replaceAll(":", "")}-models`;
  const visibleModels = useMemo(
    () => freeOnly ? models.filter((model) => model.free) : models,
    [freeOnly, models],
  );
  return (
    <div className="openrouter-model-field">
      <label className="checkbox-card" htmlFor={`${id}-free-only`}>
        <input
          checked={freeOnly}
          id={`${id}-free-only`}
          onChange={(event) => setFreeOnly(event.target.checked)}
          type="checkbox"
        />
        <span>
          <strong>{copy.freeOnlyLabel}</strong>
          <small>{visibleModels.length} {copy.catalogCountLabel}</small>
        </span>
      </label>
      <input id={id} name={name} defaultValue={defaultValue} list={listId} required />
      <datalist id={listId}>
        {visibleModels.map((model) => (
          <option key={model.id} value={model.id}>{model.name}</option>
        ))}
      </datalist>
      <p className="field-hint">
        {copy.freeRouterHint}
      </p>
    </div>
  );
}
