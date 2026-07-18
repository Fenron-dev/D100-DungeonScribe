"use client";

import { useState } from "react";
import type { WorldEntityDraft } from "@/domain/world-entity";
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
  const [generated, setGenerated] = useState<{
    version: number;
    draft: WorldEntityDraft;
  } | null>(null);
  const generator = generateWorldEntityDraftAction.bind(null, campaignId);
  function acceptDraft(draft: WorldEntityDraft): void {
    setGenerated((current) => ({ version: (current?.version ?? 0) + 1, draft }));
  }
  return (
    <>
      <CreativeDraftPanel
        action={generator}
        messages={messages}
        mode={providerMode}
        onDraft={acceptDraft}
      />
      <WorldEntityForm
        key={generated?.version ?? 0}
        action={action}
        {...(generated ? { entity: generated.draft } : {})}
        messages={messages}
        mode="create"
      />
    </>
  );
}
