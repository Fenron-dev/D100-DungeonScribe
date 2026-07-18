"use client";

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
  const generator = generateCharacterDraftAction.bind(null, campaignId);
  return (
    <CreativeDraftPanel
      action={generator}
      messages={messages}
      mode={providerMode}
      renderForm={(draft, revision) => (
        <CharacterForm
          key={revision}
          action={action}
          {...(draft ? { character: draft } : {})}
          messages={messages}
          mode="create"
        />
      )}
    />
  );
}
