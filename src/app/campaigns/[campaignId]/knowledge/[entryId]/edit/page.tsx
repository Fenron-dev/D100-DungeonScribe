import Link from "next/link";
import { notFound } from "next/navigation";
import { updateKnowledgeEntryAction } from "@/features/knowledge/actions";
import { KnowledgeEntryForm } from "@/features/knowledge/knowledge-entry-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { knowledgeEntryService } from "@/services/knowledge-entry-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface EditKnowledgePageProps {
  params: Promise<{ campaignId: string; entryId: string }>;
}

export default async function EditKnowledgePage({ params }: EditKnowledgePageProps) {
  const { campaignId, entryId } = await params;
  const [campaign, entry] = await Promise.all([
    campaignService.findById(campaignId),
    knowledgeEntryService.findById(campaignId, entryId),
  ]);
  if (!campaign || !entry) notFound();
  const [characters, entities] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
  ]);
  const messages = getMessages();
  const copy = messages.knowledge;
  const action = updateKnowledgeEntryAction.bind(null, campaign.id, entry.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/knowledge`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.editTitle}</h1>
        <p>{copy.editDescription}</p>
      </header>
      <KnowledgeEntryForm
        action={action}
        characters={characters}
        entities={entities}
        entry={entry}
        messages={messages}
        mode="edit"
      />
    </div>
  );
}
