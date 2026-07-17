import Link from "next/link";
import { notFound } from "next/navigation";
import type { KnowledgeEntry } from "@/domain/knowledge-entry";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { knowledgeEntryService } from "@/services/knowledge-entry-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface KnowledgePageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();

  const [entries, characters, entities] = await Promise.all([
    knowledgeEntryService.list(campaign.id),
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
  ]);
  const messages = getMessages();
  const copy = messages.knowledge;
  const characterNames = new Map(characters.map((character) => [character.id, character.name]));
  const entityNames = new Map(entities.map((entity) => [entity.id, entity.name]));

  return (
    <div className="world-registry-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}`}>
        <span aria-hidden="true">←</span> {copy.backToCampaign}
      </Link>
      <header className="world-registry-heading">
        <div>
          <p className="eyebrow">{campaign.name}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        {campaign.status === "active" ? (
          <Link className="button button-primary" href={`/campaigns/${campaign.id}/knowledge/new`}>
            {copy.newEntry}
          </Link>
        ) : null}
      </header>

      {entries.length > 0 ? (
        <div className="knowledge-grid">
          {entries.map((entry) => (
            <KnowledgeCard
              campaignId={campaign.id}
              characterNames={characterNames}
              entityNames={entityNames}
              entry={entry}
              key={entry.id}
            />
          ))}
        </div>
      ) : (
        <div className="character-empty">
          <h2>{copy.emptyTitle}</h2>
          <p>{copy.emptyDescription}</p>
        </div>
      )}
    </div>
  );
}

function KnowledgeCard({
  campaignId,
  characterNames,
  entityNames,
  entry,
}: {
  campaignId: string;
  characterNames: Map<string, string>;
  entityNames: Map<string, string>;
  entry: KnowledgeEntry;
}) {
  const copy = getMessages().knowledge;
  const knownBy = entry.knownByCharacterIds
    .map((id) => characterNames.get(id))
    .filter((name): name is string => Boolean(name));
  const related = entry.relatedEntityIds
    .map((id) => entityNames.get(id))
    .filter((name): name is string => Boolean(name));

  return (
    <article className={`knowledge-card knowledge-${entry.type}`}>
      <div className="entity-card-heading">
        <div>
          <p className="entity-type">{copy.types[entry.type]}</p>
          <h2>{entry.title}</h2>
        </div>
        {entry.locked ? <span className="knowledge-lock">{copy.lockedBadge}</span> : null}
      </div>
      <p>{entry.content}</p>
      <dl className="knowledge-metadata">
        <div>
          <dt>{copy.truthStatusLabel}</dt>
          <dd>{copy.truthStatuses[entry.truthStatus]}</dd>
        </div>
        <div>
          <dt>{copy.knownByLabel}</dt>
          <dd>{knownBy.length > 0 ? knownBy.join(", ") : copy.knownByNobody}</dd>
        </div>
        {related.length > 0 ? (
          <div>
            <dt>{copy.relatedEntitiesLabel}</dt>
            <dd>{related.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      <Link className="text-link" href={`/campaigns/${campaignId}/knowledge/${entry.id}/edit`}>
        {copy.editLink}
      </Link>
    </article>
  );
}
