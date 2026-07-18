import Link from "next/link";
import { notFound } from "next/navigation";
import {
  askOracleAction,
  drawInspirationAction,
  generateRandomEventAction,
} from "@/features/oracle/actions";
import {
  InspirationForm,
  OracleForm,
  RandomEventForm,
} from "@/features/oracle/oracle-form";
import {
  addSceneNoteAction,
  addSceneMessageAction,
  completeSceneAction,
  rollSceneCheckAction,
} from "@/features/scenes/actions";
import { SceneCompletionForm } from "@/features/scenes/scene-completion-form";
import {
  SceneMessageForm,
  SceneNoteForm,
  SceneRollForm,
} from "@/features/scenes/scene-journal-forms";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { sceneService } from "@/services/scene-service-instance";
import { sceneJournalService } from "@/services/scene-journal-service-instance";
import { storyThreadService } from "@/services/story-thread-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface ScenePageProps {
  params: Promise<{ campaignId: string; sceneId: string }>;
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { campaignId, sceneId } = await params;
  const [campaign, scene] = await Promise.all([
    campaignService.findById(campaignId),
    sceneService.findById(campaignId, sceneId),
  ]);
  if (!campaign || !scene) notFound();
  const [characters, entities, threads, journal] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
    storyThreadService.list(campaign.id),
    sceneJournalService.list(campaign.id, scene.id),
  ]);
  const messages = getMessages();
  const copy = messages.scenes;
  const characterNames = new Map(characters.map((character) => [character.id, character.name]));
  const entityNames = new Map(entities.map((entity) => [entity.id, entity.name]));
  const threadNames = new Map(threads.map((thread) => [thread.id, thread.title]));
  const participantNames = [
    ...scene.participantCharacterIds.map((id) => characterNames.get(id)),
    ...scene.participantEntityIds.map((id) => entityNames.get(id)),
  ].filter((name): name is string => Boolean(name));
  const relevantThreads = scene.relevantThreadIds
    .map((id) => threadNames.get(id))
    .filter((name): name is string => Boolean(name));
  const locationName = scene.locationId ? entityNames.get(scene.locationId) : null;
  const completionAction = completeSceneAction.bind(null, campaign.id, scene.id);
  const noteAction = addSceneNoteAction.bind(null, campaign.id, scene.id);
  const messageAction = addSceneMessageAction.bind(null, campaign.id, scene.id);
  const rollAction = rollSceneCheckAction.bind(null, campaign.id, scene.id);
  const oracleAction = askOracleAction.bind(null, campaign.id, scene.id);
  const inspirationAction = drawInspirationAction.bind(null, campaign.id, scene.id);
  const randomEventAction = generateRandomEventAction.bind(null, campaign.id, scene.id);
  const participantCharacters = characters.filter((character) =>
    scene.participantCharacterIds.includes(character.id),
  );

  return (
    <article className="scene-detail">
      <Link className="back-link" href={`/campaigns/${campaign.id}/scenes`}>
        <span aria-hidden="true">←</span> {copy.backToScenes}
      </Link>
      <header className="campaign-detail-header">
        <div>
          <span className={`status-badge status-${scene.status}`}>
            {scene.status === "active" ? copy.activeStatus : copy.completedStatus}
          </span>
          <span className="tension-badge">
            {messages.campaigns.tensionLabel}: {campaign.tension} / 6
          </span>
          <h1>{scene.title}</h1>
        </div>
      </header>

      <div className="scene-detail-grid">
        <section>
          <h2>{copy.expectedSetupTitle}</h2>
          <p>{scene.expectedSetup}</p>
        </section>
        <section>
          <h2>{copy.actualSetupTitle}</h2>
          <p>{scene.actualSetup}</p>
        </section>
        {scene.objective ? (
          <section>
            <h2>{copy.objectiveTitle}</h2>
            <p>{scene.objective}</p>
          </section>
        ) : null}
        {locationName || participantNames.length > 0 ? (
          <section>
            <h2>{copy.participantsTitle}</h2>
            <p>{[locationName, ...participantNames].filter(Boolean).join(", ")}</p>
          </section>
        ) : null}
        {relevantThreads.length > 0 ? (
          <section>
            <h2>{copy.relatedThreadsTitle}</h2>
            <p>{relevantThreads.join(", ")}</p>
          </section>
        ) : null}
      </div>

      <section className="scene-journal">
        <h2>{copy.journalTitle}</h2>
        <p>{copy.journalDescription}</p>
        {journal.length === 0 ? <p className="empty-copy">{copy.journalEmpty}</p> : (
          <ol className="scene-journal-list">
            {journal.map((entry) => {
              if (entry.type === "random_event") {
                return (
                  <li className="scene-journal-entry random-event-entry" key={entry.value.id}>
                    <span className="journal-entry-kind">
                      {messages.oracle.randomEventResultTitle}
                    </span>
                    <small className="random-event-trigger">
                      {messages.oracle.randomEventTriggerLabel}: {messages.oracle.randomEventTriggers[entry.value.trigger]}
                    </small>
                    {entry.value.context ? (
                      <p className="oracle-question">{entry.value.context}</p>
                    ) : null}
                    <strong className="random-event-focus">
                      {messages.oracle.eventFocuses[entry.value.focus]}
                    </strong>
                    <p className="random-event-prompt">
                      <span>{messages.oracle.eventActions[entry.value.actionId]}</span>
                      {" · "}
                      <span>{messages.oracle.eventSubjects[entry.value.subjectId]}</span>
                    </p>
                    <small>{messages.oracle.randomEventInterpretationHint}</small>
                  </li>
                );
              }
              if (entry.type === "inspiration") {
                return (
                  <li className="scene-journal-entry inspiration-entry" key={entry.value.id}>
                    <span className="journal-entry-kind">
                      {messages.oracle.inspirationResultTitle}
                    </span>
                    {entry.value.question ? (
                      <p className="oracle-question">{entry.value.question}</p>
                    ) : null}
                    <div className="inspiration-terms">
                      <div>
                        <small>{messages.oracle.categories[entry.value.primaryCategory]}</small>
                        <strong>{messages.oracle.terms[entry.value.primaryTermId]}</strong>
                      </div>
                      <span aria-hidden="true">+</span>
                      <div>
                        <small>{messages.oracle.categories[entry.value.secondaryCategory]}</small>
                        <strong>{messages.oracle.terms[entry.value.secondaryTermId]}</strong>
                      </div>
                    </div>
                  </li>
                );
              }
              if (entry.type === "oracle") {
                const modifier = entry.value.modifier >= 0
                  ? `+${entry.value.modifier}`
                  : String(entry.value.modifier);
                return (
                  <li className="scene-journal-entry oracle-entry" key={entry.value.id}>
                    <div className="scene-roll-heading">
                      <span className="journal-entry-kind">{messages.oracle.resultTitle}</span>
                      {entry.value.isDouble ? (
                        <span className="oracle-double">{messages.oracle.doubleBadge}</span>
                      ) : null}
                      {entry.value.randomEventTriggered ? (
                        <span className="oracle-event-triggered">
                          {messages.oracle.eventTriggeredBadge}
                        </span>
                      ) : null}
                    </div>
                    <p className="oracle-question">{entry.value.question}</p>
                    <strong className="oracle-answer">
                      {messages.oracle.answers[entry.value.answer]}
                    </strong>
                    <dl className="roll-facts">
                      <div>
                        <dt>{messages.oracle.diceLabel}</dt>
                        <dd>{entry.value.dice.join(" + ")}</dd>
                      </div>
                      <div>
                        <dt>{messages.oracle.calculationLabel}</dt>
                        <dd>{entry.value.rawTotal} {modifier} = {entry.value.adjustedTotal}</dd>
                      </div>
                      <div>
                        <dt>{messages.oracle.tensionAtRollLabel}</dt>
                        <dd>{entry.value.tensionAtRoll} / 6</dd>
                      </div>
                    </dl>
                    {entry.value.isDouble ? (
                      <small>{messages.oracle.doubleTriggerRule}</small>
                    ) : null}
                  </li>
                );
              }
              if (entry.type === "message") {
                return (
                  <li
                    className={`scene-journal-entry scene-message-entry message-${entry.value.role}`}
                    key={entry.value.id}
                  >
                    <span className="journal-entry-kind">
                      {copy.messageRoles[entry.value.role]}
                    </span>
                    <p>{entry.value.content}</p>
                  </li>
                );
              }
              if (entry.type === "note") {
                return (
                  <li className="scene-journal-entry" key={entry.value.id}>
                    <span className="journal-entry-kind">{copy.noteKinds[entry.value.kind]}</span>
                    <p>{entry.value.content}</p>
                  </li>
                );
              }
              const characterName = characterNames.get(entry.value.characterId) ?? copy.rollCharacterLabel;
              return (
                <li className="scene-journal-entry scene-roll-entry" key={entry.value.id}>
                  <div className="scene-roll-heading">
                    <span className="journal-entry-kind">{copy.rollResultTitle} · {characterName}</span>
                    <strong className={`roll-outcome outcome-${entry.value.result.degree}`}>
                      {copy.outcomes[entry.value.result.degree]}
                    </strong>
                  </div>
                  <p>{entry.value.action}</p>
                  <dl className="roll-facts">
                    <div><dt>{copy.diceLabel}</dt><dd>{entry.value.result.dice.join(", ")}</dd></div>
                    <div><dt>{copy.successesLabel}</dt><dd>{entry.value.result.successes}</dd></div>
                    <div><dt>{copy.thresholdLabel}</dt><dd>{entry.value.result.threshold}</dd></div>
                    <div><dt>{copy.rulesetLabel}</dt><dd>{entry.value.rulesetId} v{entry.value.rulesetVersion}</dd></div>
                  </dl>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {scene.status === "active" ? (
        <>
          <div className="scene-journal-forms">
            <SceneMessageForm action={messageAction} messages={messages} />
            <SceneNoteForm action={noteAction} messages={messages} />
            <SceneRollForm action={rollAction} characters={participantCharacters} messages={messages} />
            <OracleForm action={oracleAction} messages={messages} />
            <InspirationForm action={inspirationAction} messages={messages} />
            <RandomEventForm action={randomEventAction} messages={messages} />
          </div>
          <SceneCompletionForm action={completionAction} messages={messages} />
        </>
      ) : scene.summary ? (
        <section className="scene-summary">
          <h2>{copy.summaryTitle}</h2>
          <p>{scene.summary}</p>
        </section>
      ) : null}
    </article>
  );
}
