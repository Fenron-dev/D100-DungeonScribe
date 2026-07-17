import Link from "next/link";
import { notFound } from "next/navigation";
import { completeSceneAction } from "@/features/scenes/actions";
import { SceneCompletionForm } from "@/features/scenes/scene-completion-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
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
  const [characters, entities, threads] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
    storyThreadService.list(campaign.id),
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

      {scene.status === "active" ? (
        <SceneCompletionForm action={completionAction} messages={messages} />
      ) : scene.summary ? (
        <section className="scene-summary">
          <h2>{copy.summaryTitle}</h2>
          <p>{scene.summary}</p>
        </section>
      ) : null}
    </article>
  );
}
