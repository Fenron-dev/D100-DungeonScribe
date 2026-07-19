import Link from "next/link";
import { notFound } from "next/navigation";
import { generateNarrationAction } from "@/features/ai/actions";
import { NarrativeForm } from "@/features/ai/narrative-form";
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
  addSceneMessageAction,
  addSceneNoteAction,
  completeSceneAction,
  rollSceneCheckAction,
} from "@/features/scenes/actions";
import { SceneCompletionForm } from "@/features/scenes/scene-completion-form";
import {
  SceneMessageForm,
  SceneNoteForm,
  SceneRollForm,
} from "@/features/scenes/scene-journal-forms";
import { SceneJournalView } from "@/features/scenes/scene-journal-view";
import { SceneTabs } from "@/features/scenes/scene-tabs";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { getNarrativeProviderMode } from "@/services/narrative-service-instance";
import { sceneJournalService } from "@/services/scene-journal-service-instance";
import { sceneService } from "@/services/scene-service-instance";
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
  const [characters, entities, threads, journal, providerMode] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
    storyThreadService.list(campaign.id),
    sceneJournalService.list(campaign.id, scene.id),
    getNarrativeProviderMode(),
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
  const participantCharacters = characters.filter((character) =>
    scene.participantCharacterIds.includes(character.id),
  );
  const completionAction = completeSceneAction.bind(null, campaign.id, scene.id);
  const noteAction = addSceneNoteAction.bind(null, campaign.id, scene.id);
  const messageAction = addSceneMessageAction.bind(null, campaign.id, scene.id);
  const rollAction = rollSceneCheckAction.bind(null, campaign.id, scene.id);
  const oracleAction = askOracleAction.bind(null, campaign.id, scene.id);
  const inspirationAction = drawInspirationAction.bind(null, campaign.id, scene.id);
  const randomEventAction = generateRandomEventAction.bind(null, campaign.id, scene.id);
  const narrationAction = generateNarrationAction.bind(null, campaign.id, scene.id);

  return (
    <article className="scene-detail">
      <Link className="back-link" href={`/campaigns/${campaign.id}/scenes`}>
        <span aria-hidden="true">←</span> {copy.backToScenes}
      </Link>
      <header className="campaign-detail-header scene-heading">
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

      <details className="scene-context">
        <summary>{copy.sceneOverviewLabel}</summary>
        <div className="scene-detail-grid">
          <section><h2>{copy.expectedSetupTitle}</h2><p>{scene.expectedSetup}</p></section>
          <section><h2>{copy.actualSetupTitle}</h2><p>{scene.actualSetup}</p></section>
          {scene.objective ? <section><h2>{copy.objectiveTitle}</h2><p>{scene.objective}</p></section> : null}
          {locationName || participantNames.length > 0 ? (
            <section><h2>{copy.participantsTitle}</h2><p>{[locationName, ...participantNames].filter(Boolean).join(", ")}</p></section>
          ) : null}
          {relevantThreads.length > 0 ? (
            <section><h2>{copy.relatedThreadsTitle}</h2><p>{relevantThreads.join(", ")}</p></section>
          ) : null}
        </div>
      </details>

      <SceneTabs
        ariaLabel={copy.playTabsLabel}
        defaultTabId="scene-dialogue"
        tabs={[
          {
            id: "game-master",
            label: copy.gameMasterTab,
            content: (
              <div className="scene-workspace-panel">
                {scene.status === "active" ? (
                  <NarrativeForm action={narrationAction} messages={messages} mode={providerMode} />
                ) : null}
                <SceneJournalView
                  campaignId={campaign.id}
                  sceneId={scene.id}
                  journal={journal}
                  characterNames={characterNames}
                  messages={messages}
                  mode="narrator"
                />
              </div>
            ),
          },
          {
            id: "scene-dialogue",
            label: copy.dialogueTab,
            content: (
              <div className="scene-workspace-panel">
                {scene.status === "active" ? <SceneMessageForm action={messageAction} messages={messages} /> : null}
                <SceneJournalView
                  campaignId={campaign.id}
                  sceneId={scene.id}
                  journal={journal}
                  characterNames={characterNames}
                  messages={messages}
                  mode="messages"
                />
              </div>
            ),
          },
          {
            id: "journal",
            label: copy.journalTab,
            content: (
              <div className="scene-workspace-panel">
                <p>{copy.journalDescription}</p>
                <SceneJournalView
                  campaignId={campaign.id}
                  sceneId={scene.id}
                  journal={journal}
                  characterNames={characterNames}
                  messages={messages}
                  mode="all"
                />
              </div>
            ),
          },
          ...(scene.status === "active" ? [
            { id: "note", label: copy.noteTab, content: <SceneNoteForm action={noteAction} messages={messages} /> },
            { id: "roll", label: copy.rollTab, content: <SceneRollForm action={rollAction} characters={participantCharacters} messages={messages} /> },
            { id: "oracle", label: copy.oracleTab, content: <OracleForm action={oracleAction} messages={messages} /> },
            { id: "inspiration", label: copy.inspirationTab, content: <InspirationForm action={inspirationAction} messages={messages} /> },
            { id: "random-event", label: copy.randomEventTab, content: <RandomEventForm action={randomEventAction} messages={messages} /> },
            { id: "complete", label: copy.completeTab, content: <SceneCompletionForm action={completionAction} messages={messages} /> },
          ] : []),
        ]}
      />

      {scene.status !== "active" && scene.summary ? (
        <section className="scene-summary"><h2>{copy.summaryTitle}</h2><p>{scene.summary}</p></section>
      ) : null}
    </article>
  );
}
