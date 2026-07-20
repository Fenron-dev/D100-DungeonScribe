import { knowledgeTruthStatuses, knowledgeTypes } from "@/domain/knowledge-entry";
import type { SceneStateSuggestion } from "@/domain/scene-state-suggestion";
import type { Character } from "@/domain/character";
import type { WorldEntity } from "@/domain/world-entity";
import {
  acceptSceneStateSuggestionAction,
  dismissSceneStateSuggestionAction,
} from "@/features/scenes/actions";
import type { getMessages } from "@/i18n/messages";

export function SceneStateSuggestions({
  campaignId,
  characters,
  entities,
  messages,
  sceneId,
  suggestions,
}: {
  campaignId: string;
  characters: Character[];
  entities: WorldEntity[];
  messages: ReturnType<typeof getMessages>;
  sceneId: string;
  suggestions: SceneStateSuggestion[];
}) {
  if (suggestions.length === 0) return null;
  const copy = messages.scenes;
  return (
    <section
      aria-labelledby="scene-state-suggestions-title"
      className="scene-world-suggestions scene-state-suggestions"
    >
      <header>
        <div>
          <p className="card-kicker">{copy.stateSuggestionEyebrow}</p>
          <h2 id="scene-state-suggestions-title">{copy.stateSuggestionTitle}</h2>
        </div>
        <p>{copy.stateSuggestionDescription}</p>
      </header>
      <div className="scene-suggestion-grid">
        {suggestions.map((suggestion) => {
          const acceptFormId = `accept-state-suggestion-${suggestion.id}`;
          const acceptAction = acceptSceneStateSuggestionAction.bind(
            null,
            campaignId,
            sceneId,
            suggestion.id,
          );
          const dismissAction = dismissSceneStateSuggestionAction.bind(
            null,
            campaignId,
            sceneId,
            suggestion.id,
          );
          return (
            <article className="scene-suggestion-card" key={suggestion.id}>
              <span className="journal-entry-kind">
                {copy.stateSuggestionKinds[suggestion.kind]}
              </span>
              <h3>{suggestion.title}</h3>
              <p>{suggestion.content}</p>
              <details className="scene-suggestion-review">
                <summary>{copy.editSuggestionAction}</summary>
                <div>
                  <input form={acceptFormId} name="kind" type="hidden" value={suggestion.kind} />
                  <label htmlFor={`${suggestion.id}-title`}>{messages.knowledge.titleLabel}</label>
                  <input
                    defaultValue={suggestion.title}
                    form={acceptFormId}
                    id={`${suggestion.id}-title`}
                    maxLength={160}
                    name="title"
                    required
                    type="text"
                  />
                  <label htmlFor={`${suggestion.id}-content`}>
                    {suggestion.kind === "knowledge"
                      ? messages.knowledge.contentLabel
                      : messages.storyThreads.premiseLabel}
                  </label>
                  <textarea
                    defaultValue={suggestion.content}
                    form={acceptFormId}
                    id={`${suggestion.id}-content`}
                    maxLength={800}
                    name="content"
                    required
                    rows={3}
                  />
                  {suggestion.kind === "knowledge" ? (
                    <>
                      <p className="scene-suggestion-safety">{copy.knowledgeSafetyHint}</p>
                      <label htmlFor={`${suggestion.id}-type`}>{messages.knowledge.typeLabel}</label>
                      <select form={acceptFormId} id={`${suggestion.id}-type`} name="type" required defaultValue="">
                        <option disabled value="">{messages.knowledge.typePlaceholder}</option>
                        {knowledgeTypes.map((type) => <option key={type} value={type}>{messages.knowledge.types[type]}</option>)}
                      </select>
                      <label htmlFor={`${suggestion.id}-truth`}>{messages.knowledge.truthStatusLabel}</label>
                      <select form={acceptFormId} id={`${suggestion.id}-truth`} name="truthStatus" required defaultValue="">
                        <option disabled value="">{copy.truthStatusPlaceholder}</option>
                        {knowledgeTruthStatuses.map((status) => <option key={status} value={status}>{messages.knowledge.truthStatuses[status]}</option>)}
                      </select>
                      <fieldset className="scene-suggestion-checks">
                        <legend>{messages.knowledge.knownByLabel}</legend>
                        {characters.length === 0 ? <p>{messages.knowledge.noCharacters}</p> : characters.map((character) => (
                          <label key={character.id}>
                            <input form={acceptFormId} name="knownByCharacterIds" type="checkbox" value={character.id} />
                            {character.name}
                          </label>
                        ))}
                      </fieldset>
                      <label className="scene-suggestion-checkbox">
                        <input form={acceptFormId} name="locked" type="checkbox" />
                        {messages.knowledge.lockedLabel}
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`${suggestion.id}-urgency`}>{messages.storyThreads.urgencyLabel}</label>
                      <select defaultValue="3" form={acceptFormId} id={`${suggestion.id}-urgency`} name="urgency">
                        {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                      <label htmlFor={`${suggestion.id}-target`}>{messages.storyThreads.progressTargetLabel}</label>
                      <select defaultValue="4" form={acceptFormId} id={`${suggestion.id}-target`} name="progressTarget">
                        {[2, 4, 6, 8, 10, 12].map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                      <label htmlFor={`${suggestion.id}-next`}>{copy.nextDevelopmentLabel}</label>
                      <input form={acceptFormId} id={`${suggestion.id}-next`} maxLength={240} name="nextPossibleDevelopments" type="text" />
                    </>
                  )}
                  {entities.length > 0 ? (
                    <fieldset className="scene-suggestion-checks">
                      <legend>{messages.knowledge.relatedEntitiesLabel}</legend>
                      {entities.map((entity) => (
                        <label key={entity.id}>
                          <input form={acceptFormId} name="relatedEntityIds" type="checkbox" value={entity.id} />
                          {entity.name}
                        </label>
                      ))}
                    </fieldset>
                  ) : null}
                </div>
              </details>
              <div className="scene-suggestion-actions">
                <form action={acceptAction} id={acceptFormId}>
                  <button className="button button-primary" type="submit">{copy.acceptSuggestionAction}</button>
                </form>
                <form action={dismissAction}>
                  <button className="button button-secondary" type="submit">{copy.dismissSuggestionAction}</button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
