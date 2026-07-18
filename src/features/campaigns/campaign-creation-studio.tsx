"use client";

import { generateCampaignDraftAction } from "@/features/ai/creative-draft-actions";
import { CreativeDraftPanel } from "@/features/ai/creative-draft-panel";
import { CampaignForm } from "@/features/campaigns/campaign-form";
import type { CampaignFormAction } from "@/features/campaigns/form-state";
import type { getMessages } from "@/i18n/messages";

export function CampaignCreationStudio({
  action,
  messages,
  providerMode,
}: {
  action: CampaignFormAction;
  messages: ReturnType<typeof getMessages>;
  providerMode: "openai" | "demo";
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
        />
      )}
    />
  );
}
