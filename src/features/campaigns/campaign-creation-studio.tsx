"use client";

import { generateCampaignDraftAction } from "@/features/ai/creative-draft-actions";
import type { CampaignStylePresetOption } from "@/domain/campaign-style-preset";
import { CreativeDraftPanel } from "@/features/ai/creative-draft-panel";
import { CampaignForm } from "@/features/campaigns/campaign-form";
import type { CampaignFormAction } from "@/features/campaigns/form-state";
import type { getMessages } from "@/i18n/messages";

export function CampaignCreationStudio({
  action,
  messages,
  providerMode,
  stylePresets,
}: {
  action: CampaignFormAction;
  messages: ReturnType<typeof getMessages>;
  providerMode: "openai" | "demo";
  stylePresets: readonly CampaignStylePresetOption[];
}) {
  return (
    <CreativeDraftPanel
      action={generateCampaignDraftAction}
      messages={messages}
      mode={providerMode}
      renderForm={(draft, revision) => (
        <CampaignForm
          key={revision}
          action={action}
          {...(draft ? { campaign: draft } : {})}
          messages={messages}
          mode="create"
          stylePresets={stylePresets}
        />
      )}
    />
  );
}
