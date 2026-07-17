import Link from "next/link";
import { notFound } from "next/navigation";
import { createKnowledgeEntryAction } from "@/features/knowledge/actions";
import { KnowledgeEntryForm } from "@/features/knowledge/knowledge-entry-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface NewKnowledgePageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function NewKnowledgePage({ params }: NewKnowledgePageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();
  const [characters, entities] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
  ]);
  const messages = getMessages();
  const copy = messages.knowledge;
  const action = createKnowledgeEntryAction.bind(null, campaign.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/knowledge`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.createTitle}</h1>
        <p>{copy.createDescription}</p>
      </header>
      <KnowledgeEntryForm
        action={action}
        characters={characters}
        entities={entities}
        messages={messages}
        mode="create"
      />
    </div>
  );
}
