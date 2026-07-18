import Link from "next/link";
import type { Campaign } from "@/domain/campaign";
import type { Scene } from "@/domain/scene";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { sceneService } from "@/services/scene-service-instance";

export const dynamic = "force-dynamic";

interface PlayableCampaign {
  campaign: Campaign;
  activeScene: Scene | null;
}

function playHref({ campaign, activeScene }: PlayableCampaign): string {
  return activeScene
    ? `/campaigns/${campaign.id}/scenes/${activeScene.id}`
    : `/campaigns/${campaign.id}/scenes/new`;
}

export default async function PlayPage() {
  const campaigns = await campaignService.list();
  const playableCampaigns = await Promise.all(
    campaigns.map(async (campaign) => ({
      campaign,
      activeScene: await sceneService.findActive(campaign.id),
    })),
  );
  const [latest, ...others] = playableCampaigns;
  const messages = getMessages();
  const copy = messages.play;

  return (
    <div className="play-page">
      <header className="page-heading play-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>

      {latest ? (
        <>
          <section className="play-hero" aria-labelledby="latest-campaign-title">
            <div>
              <p className="card-kicker">
                {latest.activeScene
                  ? messages.scenes.activeTitle
                  : messages.home.lastCampaign}
              </p>
              <h2 id="latest-campaign-title">{latest.campaign.name}</h2>
              <p>{latest.activeScene?.actualSetup ?? latest.campaign.premise}</p>
            </div>
            <div className="button-row">
              <Link className="button button-primary" href={playHref(latest)}>
                {latest.activeScene ? copy.continueAction : copy.startAction}
              </Link>
              <Link
                className="button button-secondary"
                href={`/campaigns/${latest.campaign.id}`}
              >
                {messages.campaigns.openAction}
              </Link>
            </div>
          </section>

          {others.length > 0 ? (
            <section className="play-other-campaigns" aria-labelledby="other-campaigns-title">
              <h2 id="other-campaigns-title">{copy.otherCampaigns}</h2>
              <div className="campaign-card-grid">
                {others.map((entry) => (
                  <article className="play-campaign-card" key={entry.campaign.id}>
                    <h3>{entry.campaign.name}</h3>
                    <p>{entry.activeScene?.actualSetup ?? entry.campaign.premise}</p>
                    <Link className="text-link" href={playHref(entry)}>
                      {entry.activeScene ? copy.continueAction : copy.startAction}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="empty-state" aria-labelledby="no-campaign-title">
          <div className="card-symbol" aria-hidden="true">✦</div>
          <h2 id="no-campaign-title">{copy.noCampaignTitle}</h2>
          <p>{copy.noCampaignDescription}</p>
          <Link className="button button-primary" href="/campaigns/new">
            {copy.newCampaign}
          </Link>
        </section>
      )}

      {latest ? (
        <Link className="button button-secondary play-new-campaign" href="/campaigns/new">
          {copy.newCampaign}
        </Link>
      ) : null}
    </div>
  );
}
