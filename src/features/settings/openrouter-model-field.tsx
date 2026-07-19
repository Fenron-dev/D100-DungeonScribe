"use client";

import { useMemo, useState } from "react";
import type { AiModelOption } from "@/ai/model-catalog";
import type { MessageCatalog } from "@/i18n/messages";

export function OpenRouterModelField({
  defaultValue,
  copy,
  catalogAvailable,
  id,
  models,
  name = "model",
}: {
  defaultValue: string;
  copy: MessageCatalog["aiSettings"];
  catalogAvailable: boolean;
  id: string;
  models: AiModelOption[];
  name?: string;
}) {
  const [freeOnly, setFreeOnly] = useState(
    models.find(({ id: modelId }) => modelId === defaultValue)?.free
      ?? (defaultValue === "openrouter/free" || defaultValue.endsWith(":free")),
  );
  const [selectedModel, setSelectedModel] = useState(defaultValue);
  const visibleModels = useMemo(
    () => freeOnly ? models.filter((model) => model.free) : models,
    [freeOnly, models],
  );
  const selectedIsVisible = visibleModels.some(({ id: modelId }) => modelId === selectedModel);
  return (
    <div className="openrouter-model-field">
      <label className="checkbox-card" htmlFor={`${id}-free-only`}>
        <input
          checked={freeOnly}
          id={`${id}-free-only`}
          onChange={(event) => {
            const nextFreeOnly = event.target.checked;
            setFreeOnly(nextFreeOnly);
            if (nextFreeOnly && !models.find(({ id: modelId }) => modelId === selectedModel)?.free) {
              setSelectedModel("openrouter/free");
            }
          }}
          type="checkbox"
        />
        <span>
          <strong>{copy.freeOnlyLabel}</strong>
          <small>{visibleModels.length} {copy.catalogCountLabel}</small>
        </span>
      </label>
      <select
        id={id}
        name={name}
        onChange={(event) => setSelectedModel(event.target.value)}
        required
        value={selectedModel}
      >
        {!selectedIsVisible ? <option value={selectedModel}>{selectedModel}</option> : null}
        {visibleModels.map((model) => (
          <option key={model.id} value={model.id}>{model.name} · {model.id}</option>
        ))}
      </select>
      <p className={`field-hint ${catalogAvailable ? "" : "catalog-warning"}`} role={catalogAvailable ? undefined : "status"}>
        {catalogAvailable ? copy.freeRouterHint : copy.catalogUnavailable}
      </p>
    </div>
  );
}
