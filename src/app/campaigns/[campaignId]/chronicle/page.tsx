import Link from "next/link";
import { notFound } from "next/navigation";
import type { CampaignEvent } from "@/domain/campaign-event";
import { getCampaignEventCategory } from "@/domain/campaign-event";
import { getMessages } from "@/i18n/messages";
import { campaignEventCategorySchema } from "@/schemas/campaign-event";
import { campaignService } from "@/services/campaign-service-instance";
import { campaignEventService } from "@/services/campaign-event-service-instance";

export const dynamic = "force-dynamic";

interface ChroniclePageProps {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}

const germanDateTime = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function ChroniclePage({
  params,
  searchParams,
}: ChroniclePageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();

  const query = await searchParams;
  const requestedCategory = Array.isArray(query.category)
    ? query.category[0]
    : query.category;
  const categoryResult = campaignEventCategorySchema.safeParse(
    requestedCategory ?? "all",
  );
  const category = categoryResult.success ? categoryResult.data : "all";
  const events = await campaignEventService.list(campaign.id, category);
  const copy = getMessages().chronicle;

  return (
    <div className="chronicle-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}`}>
        <span aria-hidden="true">←</span> {copy.backToCampaign}
      </Link>

      <header className="world-registry-heading">
        <div>
          <p className="eyebrow">{campaign.name}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </header>

      <form className="chronicle-filter" method="get">
        <div className="form-field">
          <label htmlFor="chronicle-category">{copy.filterLabel}</label>
          <select id="chronicle-category" name="category" defaultValue={category}>
            <option value="all">{copy.categories.all}</option>
            <option value="campaign">{copy.categories.campaign}</option>
            <option value="characters">{copy.categories.characters}</option>
            <option value="world">{copy.categories.world}</option>
            <option value="knowledge">{copy.categories.knowledge}</option>
          </select>
        </div>
        <button className="button button-secondary" type="submit">
          {copy.filterAction}
        </button>
        {category !== "all" ? (
          <Link className="text-link" href={`/campaigns/${campaign.id}/chronicle`}>
            {copy.resetFilter}
          </Link>
        ) : null}
      </form>

      <p className="chronicle-result" aria-live="polite">
        <strong>{events.length}</strong> {copy.resultLabel}
      </p>

      {events.length > 0 ? (
        <ol className="chronicle-list">
          {events.map((event) => (
            <ChronicleEventCard event={event} key={event.id} />
          ))}
        </ol>
      ) : (
        <div className="character-empty">
          <h2>{copy.emptyTitle}</h2>
          <p>{copy.emptyDescription}</p>
        </div>
      )}
    </div>
  );
}

function ChronicleEventCard({ event }: { event: CampaignEvent }) {
  const copy = getMessages().chronicle;
  const category = getCampaignEventCategory(event.eventType);
  return (
    <li className={`chronicle-event chronicle-event-${category}`}>
      <div className="chronicle-marker" aria-hidden="true" />
      <article>
        <div className="chronicle-event-heading">
          <div>
            <p className="entity-type">{copy.categories[category]}</p>
            <h2>{copy.eventTypes[event.eventType]}</h2>
          </div>
          {event.reversible ? (
            <span className="entity-status">{copy.reversibleBadge}</span>
          ) : null}
        </div>
        <p>{event.summary}</p>
        <p className="chronicle-meta">
          <time dateTime={event.timestampReal.toISOString()}>
            {germanDateTime.format(event.timestampReal)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{copy.sources[event.source]}</span>
        </p>
      </article>
    </li>
  );
}
