import Link from "next/link";
import { notFound } from "next/navigation";
import { updateWorldEntityAction } from "@/features/world-entities/actions";
import { WorldEntityForm } from "@/features/world-entities/world-entity-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface EditWorldEntityPageProps {
  params: Promise<{ campaignId: string; entityId: string }>;
}

export default async function EditWorldEntityPage({
  params,
}: EditWorldEntityPageProps) {
  const { campaignId, entityId } = await params;
  const [campaign, entity] = await Promise.all([
    campaignService.findById(campaignId),
    worldEntityService.findById(campaignId, entityId),
  ]);
  if (!campaign || !entity) {
    notFound();
  }
  const messages = getMessages();
  const copy = messages.worldEntities;
  const action = updateWorldEntityAction.bind(null, campaign.id, entity.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/world`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.editTitle}</h1>
        <p>{copy.editDescription}</p>
      </header>
      <WorldEntityForm
        action={action}
        entity={entity}
        messages={messages}
        mode="edit"
      />
    </div>
  );
}
