import Link from "next/link";
import { notFound } from "next/navigation";
import { archiveCampaignAction } from "@/features/campaigns/actions";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";

export const dynamic = "force-dynamic";

interface CampaignPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) {
    notFound();
  }

  const copy = getMessages().campaigns;
  const archiveAction = archiveCampaignAction.bind(null, campaign.id);

  return (
    <article className="campaign-detail">
      <Link className="back-link" href="/campaigns">
        <span aria-hidden="true">←</span> {copy.backToList}
      </Link>

      <header className="campaign-detail-header">
        <div>
          <span className={`status-badge status-${campaign.status}`}>
            {campaign.status === "active" ? copy.activeStatus : copy.archivedStatus}
          </span>
          <h1>{campaign.name}</h1>
        </div>
        <div className="detail-actions">
          <Link
            className="button button-secondary"
            href={`/campaigns/${campaign.id}/edit`}
          >
            {copy.editLink}
          </Link>
          {campaign.status === "active" ? (
            <form action={archiveAction}>
              <button className="button button-danger" type="submit">
                {copy.archiveAction}
              </button>
            </form>
          ) : null}
        </div>
      </header>

      <section className="campaign-detail-grid">
        <div className="campaign-premise">
          <h2>{copy.premiseLabel}</h2>
          <p>{campaign.premise}</p>
        </div>
        <dl className="campaign-metadata">
          {campaign.genre ? (
            <div>
              <dt>{copy.genreLabel}</dt>
              <dd>{campaign.genre}</dd>
            </div>
          ) : null}
          {campaign.mood ? (
            <div>
              <dt>{copy.moodLabel}</dt>
              <dd>{campaign.mood}</dd>
            </div>
          ) : null}
        </dl>
      </section>
    </article>
  );
}
