import Link from "next/link";
import { notFound } from "next/navigation";
import { createStoryThreadAction } from "@/features/story-threads/actions";
import { StoryThreadForm } from "@/features/story-threads/story-thread-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface NewStoryThreadPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function NewStoryThreadPage({ params }: NewStoryThreadPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) notFound();
  const entities = await worldEntityService.list(campaign.id);
  const messages = getMessages();
  const copy = messages.storyThreads;
  const action = createStoryThreadAction.bind(null, campaign.id);
  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/threads`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.createTitle}</h1>
        <p>{copy.createDescription}</p>
      </header>
      <StoryThreadForm
        action={action}
        entities={entities}
        messages={messages}
        mode="create"
      />
    </div>
  );
}
