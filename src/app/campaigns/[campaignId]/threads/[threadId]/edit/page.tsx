import Link from "next/link";
import { notFound } from "next/navigation";
import { updateStoryThreadAction } from "@/features/story-threads/actions";
import { StoryThreadForm } from "@/features/story-threads/story-thread-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { storyThreadService } from "@/services/story-thread-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface EditStoryThreadPageProps {
  params: Promise<{ campaignId: string; threadId: string }>;
}

export default async function EditStoryThreadPage({ params }: EditStoryThreadPageProps) {
  const { campaignId, threadId } = await params;
  const [campaign, thread] = await Promise.all([
    campaignService.findById(campaignId),
    storyThreadService.findById(campaignId, threadId),
  ]);
  if (!campaign || !thread) notFound();
  const entities = await worldEntityService.list(campaign.id);
  const messages = getMessages();
  const copy = messages.storyThreads;
  const action = updateStoryThreadAction.bind(null, campaign.id, thread.id);
  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/threads`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.editTitle}</h1>
        <p>{copy.editDescription}</p>
      </header>
      <StoryThreadForm
        action={action}
        entities={entities}
        messages={messages}
        mode="edit"
        thread={thread}
      />
    </div>
  );
}
