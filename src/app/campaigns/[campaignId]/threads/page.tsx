import Link from "next/link";
import { notFound } from "next/navigation";
import type { StoryThread } from "@/domain/story-thread";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { storyThreadService } from "@/services/story-thread-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface StoryThreadsPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function StoryThreadsPage({ params }: StoryThreadsPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();
  const [threads, entities] = await Promise.all([
    storyThreadService.list(campaign.id),
    worldEntityService.list(campaign.id),
  ]);
  const messages = getMessages();
  const copy = messages.storyThreads;
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
          <Link className="button button-primary" href={`/campaigns/${campaign.id}/threads/new`}>
            {copy.newThread}
          </Link>
        ) : null}
      </header>

      {threads.length > 0 ? (
        <div className="thread-grid">
          {threads.map((thread) => (
            <StoryThreadCard
              campaignId={campaign.id}
              entityNames={entityNames}
              key={thread.id}
              thread={thread}
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

function StoryThreadCard({
  campaignId,
  entityNames,
  thread,
}: {
  campaignId: string;
  entityNames: Map<string, string>;
  thread: StoryThread;
}) {
  const copy = getMessages().storyThreads;
  const related = thread.relatedEntityIds
    .map((id) => entityNames.get(id))
    .filter((name): name is string => Boolean(name));
  return (
    <article className={`thread-card thread-${thread.status}`}>
      <div className="entity-card-heading">
        <div>
          <p className="entity-type">{copy.statuses[thread.status]}</p>
          <h2>{thread.title}</h2>
        </div>
        <span className="thread-urgency">
          {copy.urgencyLabel} {thread.urgency}
        </span>
      </div>
      <p>{thread.premise}</p>
      <div className="thread-progress">
        <div>
          <span>{copy.progressDisplay}</span>
          <strong>{thread.progressCurrent} / {thread.progressTarget}</strong>
        </div>
        <progress max={thread.progressTarget} value={thread.progressCurrent}>
          {thread.progressCurrent} / {thread.progressTarget}
        </progress>
      </div>
      {related.length > 0 ? (
        <p className="thread-related">
          <strong>{copy.relatedEntitiesLabel}:</strong> {related.join(", ")}
        </p>
      ) : null}
      {thread.nextPossibleDevelopments.length > 0 ? (
        <div className="thread-developments">
          <h3>{copy.developmentsLabel}</h3>
          <ul>
            {thread.nextPossibleDevelopments.map((development) => (
              <li key={development}>{development}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <Link className="text-link" href={`/campaigns/${campaignId}/threads/${thread.id}/edit`}>
        {copy.editLink}
      </Link>
    </article>
  );
}
