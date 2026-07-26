import {
  copyLibraryWorldEntityAction,
  removeLibraryWorldEntityAction,
} from "@/features/library/actions";
import { CampaignStylePresetForm } from "@/features/library/campaign-style-preset-form";
import {
  createStylePresetAction,
  removeStylePresetAction,
} from "@/features/library/style-preset-actions";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { campaignStylePresetService } from "@/services/campaign-style-preset-service-instance";
import { libraryWorldEntityService } from "@/services/library-world-entity-service-instance";

export const dynamic = "force-dynamic";

const stylePreviewKeys = [
  "seriousness",
  "action",
  "combat",
  "lootAmount",
] as const;

export default async function LibraryPage() {
  const [entries, campaigns, stylePresets] = await Promise.all([
    libraryWorldEntityService.list(),
    campaignService.list(),
    campaignStylePresetService.list(),
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

      <section aria-labelledby="library-style-title">
        <header className="section-heading">
          <div>
            <h2 id="library-style-title">{copy.stylePresetsTitle}</h2>
            <p>{copy.stylePresetsDescription}</p>
          </div>
        </header>

        <details className="library-create-panel">
          <summary>{copy.createPresetTitle}</summary>
          <div>
            <p>{copy.createPresetDescription}</p>
            <CampaignStylePresetForm
              action={createStylePresetAction}
              messages={messages}
            />
          </div>
        </details>

        {stylePresets.length > 0 ? (
          <div className="library-grid style-preset-grid">
            {stylePresets.map((preset) => {
              const removeAction = removeStylePresetAction.bind(
                null,
                preset.id,
              );
              return (
                <article className="library-card" key={preset.id}>
                  <div className="entity-card-heading">
                    <div>
                      <p className="entity-type">
                        {copy.presetBaseLabel}: {messages.campaigns.templates[preset.baseTemplateId]}
                      </p>
                      <h3>{preset.name}</h3>
                    </div>
                  </div>
                  {preset.description ? <p>{preset.description}</p> : null}
                  <dl className="style-preset-preview">
                    {stylePreviewKeys.map((key) => (
                      <div key={key}>
                        <dt>{messages.campaigns.styleAxes[key].label}</dt>
                        <dd>{preset.style[key]} / 5</dd>
                      </div>
                    ))}
                  </dl>
                  <form action={removeAction}>
                    <button className="text-button danger-text" type="submit">
                      {copy.removePresetAction}
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="character-empty compact-empty">
            <h3>{copy.noPresetsTitle}</h3>
            <p>{copy.noPresetsDescription}</p>
          </div>
        )}
      </section>

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
