import Link from "next/link";
import { notFound } from "next/navigation";
import { createWorldEntityAction } from "@/features/world-entities/actions";
import { WorldEntityCreationStudio } from "@/features/world-entities/world-entity-creation-studio";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { getCreativeDraftProviderMode } from "@/services/creative-draft-service-instance";

export const dynamic = "force-dynamic";

interface NewWorldEntityPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function NewWorldEntityPage({
  params,
}: NewWorldEntityPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) {
    notFound();
  }
  const messages = getMessages();
  const copy = messages.worldEntities;
  const action = createWorldEntityAction.bind(null, campaign.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/world`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.createTitle}</h1>
        <p>{copy.createDescription}</p>
      </header>
      <WorldEntityCreationStudio
        action={action}
        campaignId={campaign.id}
        messages={messages}
        providerMode={await getCreativeDraftProviderMode()}
      />
    </div>
  );
}
