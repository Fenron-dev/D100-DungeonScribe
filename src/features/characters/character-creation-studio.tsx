"use client";

import { useState } from "react";
import type { CharacterDraft } from "@/domain/character";
import { generateCharacterDraftAction } from "@/features/ai/creative-draft-actions";
import { CreativeDraftPanel } from "@/features/ai/creative-draft-panel";
import { CharacterForm } from "@/features/characters/character-form";
import type { CharacterFormAction } from "@/features/characters/form-state";
import type { getMessages } from "@/i18n/messages";

export function CharacterCreationStudio({
  action,
  campaignId,
  messages,
  providerMode,
}: {
  action: CharacterFormAction;
  campaignId: string;
  messages: ReturnType<typeof getMessages>;
  providerMode: "openai" | "demo";
}) {
  const [generated, setGenerated] = useState<{
    version: number;
    draft: CharacterDraft;
  } | null>(null);
  const generator = generateCharacterDraftAction.bind(null, campaignId);
  function acceptDraft(draft: CharacterDraft): void {
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
      <CharacterForm
        key={generated?.version ?? 0}
        action={action}
        {...(generated ? { character: generated.draft } : {})}
        messages={messages}
        mode="create"
      />
    </>
  );
}
