import type { SceneWorldSuggestion } from "@/domain/scene-world-suggestion";
import { worldEntityTypes } from "@/domain/world-entity";
import {
  acceptSceneWorldSuggestionAction,
  dismissSceneWorldSuggestionAction,
} from "@/features/scenes/actions";
import type { getMessages } from "@/i18n/messages";

export function SceneWorldSuggestions({
  campaignId,
  messages,
  sceneId,
  suggestions,
}: {
  campaignId: string;
  messages: ReturnType<typeof getMessages>;
  sceneId: string;
  suggestions: SceneWorldSuggestion[];
}) {
  if (suggestions.length === 0) return null;
  const copy = messages.scenes;
  return (
    <section
      aria-labelledby="scene-world-suggestions-title"
      className="scene-world-suggestions"
    >
      <header>
        <div>
          <p className="card-kicker">{copy.suggestionEyebrow}</p>
          <h2 id="scene-world-suggestions-title">{copy.suggestionTitle}</h2>
        </div>
        <p>{copy.suggestionDescription}</p>
      </header>
      <div className="scene-suggestion-grid">
        {suggestions.map((suggestion) => {
          const acceptFormId = `accept-scene-suggestion-${suggestion.id}`;
          const acceptAction = acceptSceneWorldSuggestionAction.bind(
            null,
            campaignId,
            sceneId,
            suggestion.id,
          );
          const dismissAction = dismissSceneWorldSuggestionAction.bind(
            null,
            campaignId,
            sceneId,
            suggestion.id,
          );
          return (
            <article className="scene-suggestion-card" key={suggestion.id}>
              <span className="journal-entry-kind">
                {copy.suggestionTypes[suggestion.type]}
              </span>
              <h3>{suggestion.name}</h3>
              <p>{suggestion.summary}</p>
              <details className="scene-suggestion-review">
                <summary>{copy.editSuggestionAction}</summary>
                <div>
                  <label htmlFor={`${suggestion.id}-type`}>
                    {copy.suggestionTypeLabel}
                  </label>
                  <select
                    defaultValue={suggestion.type}
                    form={acceptFormId}
                    id={`${suggestion.id}-type`}
                    name="type"
                  >
                    {worldEntityTypes.map((type) => (
                      <option key={type} value={type}>
                        {copy.suggestionTypes[type]}
                      </option>
                    ))}
                  </select>
                  <label htmlFor={`${suggestion.id}-name`}>
                    {copy.suggestionNameLabel}
                  </label>
                  <input
                    defaultValue={suggestion.name}
                    form={acceptFormId}
                    id={`${suggestion.id}-name`}
                    maxLength={100}
                    name="name"
                    required
                    type="text"
                  />
                  <label htmlFor={`${suggestion.id}-summary`}>
                    {copy.suggestionSummaryLabel}
                  </label>
                  <textarea
                    defaultValue={suggestion.summary}
                    form={acceptFormId}
                    id={`${suggestion.id}-summary`}
                    maxLength={500}
                    name="summary"
                    required
                    rows={3}
                  />
                </div>
              </details>
              <div className="scene-suggestion-actions">
                <form action={acceptAction} id={acceptFormId}>
                  <button className="button button-primary" type="submit">
                    {copy.acceptSuggestionAction}
                  </button>
                </form>
                <form action={dismissAction}>
                  <button className="button button-secondary" type="submit">
                    {copy.dismissSuggestionAction}
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
