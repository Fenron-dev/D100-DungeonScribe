import {
  copyLibraryWorldEntityAction,
  removeLibraryWorldEntityAction,
} from "@/features/library/actions";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { libraryWorldEntityService } from "@/services/library-world-entity-service-instance";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const [entries, campaigns] = await Promise.all([
    libraryWorldEntityService.list(),
    campaignService.list(),
  ]);
  const messages = getMessages();
  const copy = messages.library;

  return (
    <div className="library-page">
      <header className="page-heading library-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>

      <section aria-labelledby="library-world-title">
        <header className="section-heading">
          <div>
            <h2 id="library-world-title">{copy.worldEntitiesTitle}</h2>
            <p>{copy.worldEntitiesDescription}</p>
          </div>
        </header>

        {entries.length > 0 ? (
          <div className="library-grid">
            {entries.map((entry) => {
              const copyAction = copyLibraryWorldEntityAction.bind(
                null,
                entry.id,
              );
              const removeAction = removeLibraryWorldEntityAction.bind(
                null,
                entry.sourceEntityId,
              );
              return (
                <article className="library-card" key={entry.id}>
                  <div className="entity-card-heading">
                    <div>
                      <p className="entity-type">
                        {messages.worldEntities.types[entry.draft.type]}
                      </p>
                      <h3>{entry.draft.name}</h3>
                    </div>
                    <span className="status-badge status-active">
                      {copy.sourceHint}
                    </span>
                  </div>
                  <p>{entry.draft.summary}</p>
                  {entry.draft.tags.length > 0 ? (
                    <ul
                      className="entity-tags"
                      aria-label={messages.worldEntities.tagsLabel}
                    >
                      {entry.draft.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                  {campaigns.length > 0 ? (
                    <form action={copyAction} className="library-copy-form">
                      <label>
                        {copy.targetCampaignLabel}
                        <select defaultValue="" name="campaignId" required>
                          <option disabled value="">
                            {copy.targetCampaignPlaceholder}
                          </option>
                          {campaigns.map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="button button-secondary"
                        type="submit"
                      >
                        {copy.copyAction}
                      </button>
                    </form>
                  ) : (
                    <p className="empty-copy">{copy.noActiveCampaigns}</p>
                  )}
                  <form action={removeAction}>
                    <button className="text-button danger-text" type="submit">
                      {copy.removeAction}
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="character-empty">
            <h2>{copy.emptyTitle}</h2>
            <p>{copy.emptyDescription}</p>
          </div>
        )}
      </section>
    </div>
  );
}
