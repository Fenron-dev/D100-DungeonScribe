"use client";

import { generateWorldEntityDraftAction } from "@/features/ai/creative-draft-actions";
import { CreativeDraftPanel } from "@/features/ai/creative-draft-panel";
import type { getMessages } from "@/i18n/messages";
import { WorldEntityForm } from "@/features/world-entities/world-entity-form";
import type { WorldEntityFormAction } from "@/features/world-entities/form-state";

export function WorldEntityCreationStudio({
  action,
  campaignId,
  messages,
  providerMode,
}: {
  action: WorldEntityFormAction;
  campaignId: string;
  messages: ReturnType<typeof getMessages>;
  providerMode: "openai" | "demo";
}) {
  const generator = generateWorldEntityDraftAction.bind(null, campaignId);
  return (
    <CreativeDraftPanel
      action={generator}
      messages={messages}
      mode={providerMode}
      renderForm={(draft, revision) => (
        <WorldEntityForm
          key={revision}
          action={action}
          {...(draft ? { entity: draft } : {})}
          messages={messages}
          mode="create"
        />
      )}
    />
  );
}
