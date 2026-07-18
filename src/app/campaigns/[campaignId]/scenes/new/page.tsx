import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSceneAction } from "@/features/scenes/actions";
import { SceneCreationStudio } from "@/features/scenes/scene-creation-studio";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { sceneService } from "@/services/scene-service-instance";
import { storyThreadService } from "@/services/story-thread-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";
import { getCreativeDraftProviderMode } from "@/services/creative-draft-service-instance";

export const dynamic = "force-dynamic";

interface NewScenePageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function NewScenePage({ params }: NewScenePageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();
  const activeScene = await sceneService.findActive(campaign.id);
  if (activeScene) redirect(`/campaigns/${campaign.id}/scenes/${activeScene.id}`);
  const [characters, entities, threads] = await Promise.all([
    characterService.list(campaign.id),
    worldEntityService.list(campaign.id),
    storyThreadService.list(campaign.id),
  ]);
  const messages = getMessages();
  const copy = messages.scenes;
  const action = createSceneAction.bind(null, campaign.id);
  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/scenes`}>
        <span aria-hidden="true">←</span> {copy.backToScenes}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.createTitle}</h1>
        <p>{copy.createDescription}</p>
      </header>
      <SceneCreationStudio
        action={action}
        campaignId={campaign.id}
        characters={characters}
        entities={entities}
        messages={messages}
        providerMode={await getCreativeDraftProviderMode()}
        threads={threads}
      />
    </div>
  );
}
