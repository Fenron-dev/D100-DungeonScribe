import Link from "next/link";
import { getMessages } from "@/i18n/messages";

export default function HomePage() {
  const messages = getMessages();

  return (
    <div className="home-grid">
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">{messages.home.eyebrow}</p>
        <h1 id="home-title">{messages.home.title}</h1>
        <p className="hero-description">{messages.home.description}</p>
        <div className="button-row">
          <Link className="button button-primary" href="/campaigns/new">
            {messages.home.newCampaign}
          </Link>
          <Link className="button button-secondary" href="/campaigns">
            {messages.home.openCampaigns}
          </Link>
        </div>
      </section>

      <section className="continue-card" aria-labelledby="continue-title">
        <div className="card-symbol" aria-hidden="true">
          ✦
        </div>
        <div>
          <p className="card-kicker">{messages.home.lastCampaign}</p>
          <h2 id="continue-title">{messages.home.continueTitle}</h2>
          <p>{messages.home.continueDescription}</p>
        </div>
      </section>

      <section className="foundations" aria-labelledby="foundations-title">
        <h2 id="foundations-title">{messages.home.foundationsTitle}</h2>
        <ul>
          {messages.home.foundations.map((foundation) => (
            <li key={foundation}>{foundation}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
