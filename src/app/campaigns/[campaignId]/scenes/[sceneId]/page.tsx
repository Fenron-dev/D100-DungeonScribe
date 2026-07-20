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
  completeSceneAction,
  rollSceneCheckAction,
  submitSceneComposerAction,
} from "@/features/scenes/actions";
import { SceneCompletionForm } from "@/features/scenes/scene-completion-form";
import { SceneRollForm } from "@/features/scenes/scene-journal-forms";
import { SceneJournalView } from "@/features/scenes/scene-journal-view";
import { SceneComposer } from "@/features/scenes/scene-composer";
import { ScenePlayWorkspace } from "@/features/scenes/scene-play-workspace";
import { SceneReferencePanel } from "@/features/scenes/scene-reference-panel";
import { SceneWorldSuggestions } from "@/features/scenes/scene-world-suggestions";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { getNarrativeProviderMode } from "@/services/narrative-service-instance";
import { loadAiProfileVault } from "@/services/ai-profile-vault-service";
import { sceneJournalService } from "@/services/scene-journal-service-instance";
import { sceneService } from "@/services/scene-service-instance";
import { storyThreadService } from "@/services/story-thread-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";
import { sceneWorldSuggestionService } from "@/services/scene-world-suggestion-service-instance";

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
  const [characters, entities, threads, journal, suggestions, providerMode, profileVault] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
    storyThreadService.list(campaign.id),
    sceneJournalService.list(campaign.id, scene.id),
    sceneWorldSuggestionService.listPending(campaign.id, scene.id),
    getNarrativeProviderMode(),
    loadAiProfileVault(),
  ]);
  const messages = getMessages();
  const copy = messages.scenes;
  const characterNames = new Map(characters.map((character) => [character.id, character.name]));
  const entityNames = new Map(entities.map((entity) => [entity.id, entity.name]));
  const participantNames = [
    ...scene.participantCharacterIds.map((id) => characterNames.get(id)),
    ...scene.participantEntityIds.map((id) => entityNames.get(id)),
  ].filter((name): name is string => Boolean(name));
  const sceneThreads = threads.filter((thread) => scene.relevantThreadIds.includes(thread.id));
  const relevantThreads = sceneThreads.map(({ title }) => title);
  const locationName = scene.locationId ? entityNames.get(scene.locationId) : null;
  const referencedEntityIds = new Set([
    ...scene.participantEntityIds,
    ...(scene.locationId ? [scene.locationId] : []),
  ]);
  const sceneEntities = entities.filter((entity) => referencedEntityIds.has(entity.id));
  const participantCharacters = characters.filter((character) =>
    scene.participantCharacterIds.includes(character.id),
  );
  const completionAction = completeSceneAction.bind(null, campaign.id, scene.id);
  const composerAction = submitSceneComposerAction.bind(null, campaign.id, scene.id);
  const rollAction = rollSceneCheckAction.bind(null, campaign.id, scene.id);
  const oracleAction = askOracleAction.bind(null, campaign.id, scene.id);
  const inspirationAction = drawInspirationAction.bind(null, campaign.id, scene.id);
  const randomEventAction = generateRandomEventAction.bind(null, campaign.id, scene.id);
  const narrationAction = generateNarrationAction.bind(null, campaign.id, scene.id);
  const profileOptions = (profileVault?.profiles ?? []).map((profile) => ({
    id: profile.id,
    label: `${profile.name} · ${profile.model}`,
  }));
  const activeProfileId = profileVault?.activeProfileId ?? profileOptions[0]?.id ?? "";
  const sceneOverview = (
    <div className="scene-detail-grid scene-overview-grid">
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
  );

  return (
    <article className="scene-detail">
      <div className="scene-topline">
        <Link className="back-link" href={`/campaigns/${campaign.id}/scenes`}>
          <span aria-hidden="true">←</span> {copy.backToScenes}
        </Link>
      </div>
      <div className="scene-status-strip" aria-label={copy.sceneStatusLabel}>
        <span className={`status-badge status-${scene.status}`}>
          {scene.status === "active" ? copy.activeStatus : copy.completedStatus}
        </span>
        <span className="tension-badge">
          {messages.campaigns.tensionLabel}: {campaign.tension} / 6
        </span>
      </div>
      <header className="campaign-detail-header scene-heading">
        <div>
          <h1>{scene.title}</h1>
        </div>
      </header>
      <ScenePlayWorkspace
        closeLabel={copy.closeToolLabel}
        composer={scene.status === "active" ? (
          <SceneComposer
            action={composerAction}
            activeProfileId={activeProfileId}
            messages={messages}
            profiles={profileOptions}
          />
        ) : null}
        journal={(
          <>
            <SceneWorldSuggestions
              campaignId={campaign.id}
              messages={messages}
              sceneId={scene.id}
              suggestions={suggestions}
            />
            <SceneJournalView
              activeProfileId={activeProfileId}
              campaignId={campaign.id}
              characterNames={characterNames}
              journal={journal}
              messages={messages}
              mode="all"
              profiles={profileOptions}
              sceneId={scene.id}
            />
          </>
        )}
        journalPanelLabel={copy.journalTab}
        referencePanel={(
          <SceneReferencePanel
            characters={participantCharacters}
            entities={sceneEntities}
            messages={messages}
            threads={sceneThreads}
          />
        )}
        referencePanelLabel={copy.referencePanelLabel}
        resizeLabel={copy.resizeWorkspaceLabel}
        toolLabel={copy.toolButtonsLabel}
        tools={[
          { id: "overview", label: copy.sceneOverviewLabel, content: sceneOverview },
          ...(scene.status === "active" ? [
            { id: "game-master", label: copy.gameMasterTab, content: <NarrativeForm action={narrationAction} messages={messages} mode={providerMode} /> },
            { id: "roll", label: copy.rollTab, content: <SceneRollForm action={rollAction} characters={participantCharacters} messages={messages} /> },
            { id: "oracle", label: copy.oracleTab, content: <OracleForm action={oracleAction} messages={messages} /> },
            { id: "inspiration", label: copy.museTab, content: <InspirationForm action={inspirationAction} messages={messages} /> },
            { id: "random-event", label: copy.randomEventTab, content: <RandomEventForm action={randomEventAction} messages={messages} /> },
            { id: "complete", label: copy.completeTab, content: <SceneCompletionForm action={completionAction} messages={messages} />, danger: true },
          ] : scene.summary ? [
            { id: "summary", label: copy.summaryTitle, content: <section className="scene-summary"><p>{scene.summary}</p></section> },
          ] : []),
        ]}
      />
    </article>
  );
}
