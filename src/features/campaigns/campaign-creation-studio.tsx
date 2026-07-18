"use client";

import { useState } from "react";
import type { CampaignDraft } from "@/domain/campaign";
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
  const [generated, setGenerated] = useState<{
    version: number;
    draft: CampaignDraft;
  } | null>(null);
  function acceptDraft(draft: CampaignDraft): void {
    setGenerated((current) => ({ version: (current?.version ?? 0) + 1, draft }));
  }
  return (
    <>
      <CreativeDraftPanel
        action={generateCampaignDraftAction}
        messages={messages}
        mode={providerMode}
        onDraft={acceptDraft}
      />
      <CampaignForm
        key={generated?.version ?? 0}
        action={action}
        {...(generated ? { campaign: generated.draft } : {})}
        messages={messages}
        mode="create"
      />
    </>
  );
}
