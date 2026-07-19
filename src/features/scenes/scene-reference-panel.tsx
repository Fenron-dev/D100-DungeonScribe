import type { Character } from "@/domain/character";
import type { StoryThread } from "@/domain/story-thread";
import type { WorldEntity } from "@/domain/world-entity";
import type { getMessages } from "@/i18n/messages";

export function SceneReferencePanel({
  characters,
  entities,
  threads,
  messages,
}: {
  characters: Character[];
  entities: WorldEntity[];
  threads: StoryThread[];
  messages: ReturnType<typeof getMessages>;
}) {
  const copy = messages.scenes;
  if (characters.length === 0 && entities.length === 0 && threads.length === 0) {
    return <p className="empty-copy">{copy.referenceEmpty}</p>;
  }
  return (
    <div className="scene-reference-panel">
      {characters.length > 0 ? (
        <section>
          <h2>{copy.referenceCharactersTitle}</h2>
          <div className="scene-reference-list">
            {characters.map((character) => (
              <article className="scene-reference-card reference-character" key={character.id}>
                <div>
                  <strong>{character.name}</strong>
                  <small>{messages.characters.archetypes[character.archetype]}</small>
                </div>
                <p>{character.concept}</p>
                <ul className="tag-list">
                  {character.traits.map((trait) => <li key={trait}>{trait}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {entities.length > 0 ? (
        <section>
          <h2>{copy.referenceWorldTitle}</h2>
          <div className="scene-reference-list">
            {entities.map((entity) => (
              <article className="scene-reference-card reference-entity" key={entity.id}>
                <div>
                  <strong>{entity.name}</strong>
                  <small>{messages.worldEntities.types[entity.type]}</small>
                </div>
                <p>{entity.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {threads.length > 0 ? (
        <section>
          <h2>{copy.referenceThreadsTitle}</h2>
          <div className="scene-reference-list">
            {threads.map((thread) => (
              <article className="scene-reference-card reference-thread" key={thread.id}>
                <div>
                  <strong>{thread.title}</strong>
                  <small>{messages.storyThreads.statuses[thread.status]}</small>
                </div>
                <p>{thread.premise}</p>
                <div className="reference-progress" aria-label={messages.storyThreads.progressDisplay}>
                  <span style={{ width: `${(thread.progressCurrent / thread.progressTarget) * 100}%` }} />
                </div>
                <small>{thread.progressCurrent} / {thread.progressTarget}</small>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
