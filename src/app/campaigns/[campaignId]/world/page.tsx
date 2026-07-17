import Link from "next/link";
import { notFound } from "next/navigation";
import type { WorldEntity } from "@/domain/world-entity";
import { getMessages } from "@/i18n/messages";
import { worldEntityFilterSchema } from "@/schemas/world-entity";
import { campaignService } from "@/services/campaign-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

type SearchValue = string | string[] | undefined;

interface WorldRegistryPageProps {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<Record<string, SearchValue>>;
}

function firstValue(value: SearchValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function WorldEntityCard({ entity }: { entity: WorldEntity }) {
  const copy = getMessages().worldEntities;

  return (
    <article className="world-entity-card">
      <div className="entity-card-heading">
        <div>
          <p className="entity-type">{copy.types[entity.type]}</p>
          <h2>{entity.name}</h2>
        </div>
        <span className={`entity-status entity-status-${entity.status}`}>
          {copy.statuses[entity.status]}
        </span>
      </div>
      <p>{entity.summary}</p>
      {entity.tags.length > 0 ? (
        <ul className="entity-tags" aria-label={copy.tagsLabel}>
          {entity.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      <Link
        className="text-link"
        href={`/campaigns/${entity.campaignId}/world/${entity.id}/edit`}
      >
        {copy.editLink}
      </Link>
    </article>
  );
}

export default async function WorldRegistryPage({
  params,
  searchParams,
}: WorldRegistryPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) {
    notFound();
  }

  const rawSearch = await searchParams;
  const parsedFilter = worldEntityFilterSchema.safeParse({
    query: firstValue(rawSearch.query),
    type: firstValue(rawSearch.type) || undefined,
  });
  const filter = parsedFilter.success ? parsedFilter.data : {};
  const entities = await worldEntityService.list(campaign.id, filter);
  const copy = getMessages().worldEntities;
  const hasFilter = Boolean(filter.query || filter.type);

  return (
    <div className="world-registry">
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
          <Link
            className="button button-primary"
            href={`/campaigns/${campaign.id}/world/new`}
          >
            {copy.newEntity}
          </Link>
        ) : null}
      </header>

      <form className="world-filter" method="get" role="search">
        <div className="form-field">
          <label htmlFor="world-query">{copy.searchLabel}</label>
          <input
            id="world-query"
            name="query"
            type="search"
            defaultValue={filter.query ?? ""}
            placeholder={copy.searchPlaceholder}
            maxLength={120}
          />
        </div>
        <div className="form-field">
          <label htmlFor="world-type">{copy.typeLabel}</label>
          <select id="world-type" name="type" defaultValue={filter.type ?? ""}>
            <option value="">{copy.allTypes}</option>
            <option value="npc">{copy.types.npc}</option>
            <option value="location">{copy.types.location}</option>
            <option value="faction">{copy.types.faction}</option>
            <option value="item">{copy.types.item}</option>
          </select>
        </div>
        <button className="button button-secondary" type="submit">
          {copy.filterAction}
        </button>
        {hasFilter ? (
          <Link className="text-link" href={`/campaigns/${campaign.id}/world`}>
            {copy.resetFilter}
          </Link>
        ) : null}
      </form>

      {entities.length > 0 ? (
        <div className="world-entity-grid">
          {entities.map((entity) => (
            <WorldEntityCard entity={entity} key={entity.id} />
          ))}
        </div>
      ) : (
        <div className="character-empty">
          <h2>{hasFilter ? copy.noResults : copy.emptyTitle}</h2>
          {!hasFilter ? <p>{copy.emptyDescription}</p> : null}
        </div>
      )}
    </div>
  );
}
