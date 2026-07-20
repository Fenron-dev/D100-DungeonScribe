import type { SceneWorldSuggestion } from "@/domain/scene-world-suggestion";
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
              <div className="scene-suggestion-actions">
                <form action={acceptAction}>
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
