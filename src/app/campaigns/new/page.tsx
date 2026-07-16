import Link from "next/link";
import { CampaignForm } from "@/features/campaigns/campaign-form";
import { createCampaignAction } from "@/features/campaigns/actions";
import { getMessages } from "@/i18n/messages";

export default function NewCampaignPage() {
  const messages = getMessages();
  const copy = messages.campaigns;

  return (
    <div className="form-page">
      <Link className="back-link" href="/campaigns">
        <span aria-hidden="true">←</span> {copy.backToList}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.createTitle}</h1>
        <p>{copy.createDescription}</p>
      </header>
      <CampaignForm
        action={createCampaignAction}
        messages={messages}
        mode="create"
      />
    </div>
  );
}
