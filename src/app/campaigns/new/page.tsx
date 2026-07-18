import Link from "next/link";
import { createCampaignAction } from "@/features/campaigns/actions";
import { CampaignCreationStudio } from "@/features/campaigns/campaign-creation-studio";
import { getMessages } from "@/i18n/messages";
import { getCreativeDraftProviderMode } from "@/services/creative-draft-service-instance";

export default async function NewCampaignPage() {
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
      <CampaignCreationStudio
        action={createCampaignAction}
        messages={messages}
        providerMode={await getCreativeDraftProviderMode()}
      />
    </div>
  );
}
