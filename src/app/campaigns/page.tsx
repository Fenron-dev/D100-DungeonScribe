import Link from "next/link";
import type { Campaign } from "@/domain/campaign";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";

export const dynamic = "force-dynamic";

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const copy = getMessages().campaigns;
  const date = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(campaign.updatedAt);

  return (
    <article className="campaign-card">
      <div className="campaign-card-header">
        <span className={`status-badge status-${campaign.status}`}>
          {campaign.status === "active" ? copy.activeStatus : copy.archivedStatus}
        </span>
        <span className="campaign-date">
          {copy.updatedLabel}: {date}
        </span>
      </div>
      <h3>{campaign.name}</h3>
      <p>{campaign.premise}</p>
      <div className="campaign-tags">
        {campaign.genre ? <span>{campaign.genre}</span> : null}
        {campaign.mood ? <span>{campaign.mood}</span> : null}
      </div>
      <Link className="text-link" href={`/campaigns/${campaign.id}`}>
        {copy.openAction} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default async function CampaignsPage() {
  const messages = getMessages();
  const copy = messages.campaigns;
  const campaigns = await campaignService.list(true);
  const activeCampaigns = campaigns.filter(({ status }) => status === "active");
  const archivedCampaigns = campaigns.filter(
    ({ status }) => status === "archived",
  );

  return (
    <div className="campaign-library">
      <header className="page-heading campaign-heading">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        <Link className="button button-primary" href="/campaigns/new">
          {copy.newCampaign}
        </Link>
      </header>

      {campaigns.length === 0 ? (
        <section className="empty-state">
          <div className="card-symbol" aria-hidden="true">
            ✦
          </div>
          <h2>{copy.emptyTitle}</h2>
          <p>{copy.emptyDescription}</p>
          <Link className="button button-primary" href="/campaigns/new">
            {copy.newCampaign}
          </Link>
        </section>
      ) : (
        <>
          {activeCampaigns.length > 0 ? (
            <section
              className="campaign-section"
              aria-labelledby="active-campaigns"
            >
              <h2 id="active-campaigns">{copy.activeSection}</h2>
              <div className="campaign-card-grid">
                {activeCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </section>
          ) : null}

          {archivedCampaigns.length > 0 ? (
            <section
              className="campaign-section archived-campaigns"
              aria-labelledby="archived-campaigns"
            >
              <h2 id="archived-campaigns">{copy.archivedSection}</h2>
              <div className="campaign-card-grid">
                {archivedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
