import Link from "next/link";
import { notFound } from "next/navigation";
import type { Scene } from "@/domain/scene";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { sceneService } from "@/services/scene-service-instance";

export const dynamic = "force-dynamic";

interface ScenesPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function ScenesPage({ params }: ScenesPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();
  const scenes = await sceneService.list(campaign.id);
  const activeScene = scenes.find((scene) => scene.status === "active");
  const completedScenes = scenes.filter((scene) => scene.status === "completed");
  const copy = getMessages().scenes;

  return (
    <div className="world-registry-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}`}>
        <span aria-hidden="true">←</span> {copy.backToCampaign}
      </Link>
      <header className="world-registry-heading">
        <div>
          <p className="eyebrow">{campaign.name}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        {!activeScene && campaign.status === "active" ? (
          <Link className="button button-primary" href={`/campaigns/${campaign.id}/scenes/new`}>
            {copy.newScene}
          </Link>
        ) : null}
      </header>

      {activeScene ? (
        <section className="scene-section" aria-labelledby="active-scene-title">
          <h2 id="active-scene-title">{copy.activeTitle}</h2>
          <SceneCard campaignId={campaign.id} scene={activeScene} />
        </section>
      ) : null}

      {completedScenes.length > 0 ? (
        <section className="scene-section" aria-labelledby="completed-scenes-title">
          <h2 id="completed-scenes-title">{copy.completedTitle}</h2>
          <div className="scene-grid">
            {completedScenes.map((scene) => (
              <SceneCard campaignId={campaign.id} key={scene.id} scene={scene} />
            ))}
          </div>
        </section>
      ) : null}

      {scenes.length === 0 ? (
        <div className="character-empty">
          <h2>{copy.emptyTitle}</h2>
          <p>{copy.emptyDescription}</p>
        </div>
      ) : null}
    </div>
  );
}

function SceneCard({ campaignId, scene }: { campaignId: string; scene: Scene }) {
  const copy = getMessages().scenes;
  return (
    <article className={`scene-card scene-${scene.status}`}>
      <div className="entity-card-heading">
        <div>
          <p className="entity-type">
            {scene.status === "active" ? copy.activeStatus : copy.completedStatus}
          </p>
          <h3>{scene.title}</h3>
        </div>
      </div>
      <p>{scene.actualSetup}</p>
      {scene.summary ? <p className="scene-card-summary">{scene.summary}</p> : null}
      <Link className="text-link" href={`/campaigns/${campaignId}/scenes/${scene.id}`}>
        {copy.openAction}
      </Link>
    </article>
  );
}
