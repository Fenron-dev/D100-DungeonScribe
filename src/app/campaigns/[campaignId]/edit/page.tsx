import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCampaignAction } from "@/features/campaigns/actions";
import { CampaignForm } from "@/features/campaigns/campaign-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";

export const dynamic = "force-dynamic";

interface EditCampaignPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function EditCampaignPage({
  params,
}: EditCampaignPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) {
    notFound();
  }

  const messages = getMessages();
  const copy = messages.campaigns;
  const updateAction = updateCampaignAction.bind(null, campaign.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}`}>
        <span aria-hidden="true">←</span> {campaign.name}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.editTitle}</h1>
        <p>{copy.editDescription}</p>
      </header>
      <CampaignForm
        action={updateAction}
        campaign={campaign}
        messages={messages}
        mode="edit"
      />
    </div>
  );
}
