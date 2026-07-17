import Link from "next/link";
import { notFound } from "next/navigation";
import type { Character } from "@/domain/character";
import { archiveCampaignAction } from "@/features/campaigns/actions";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";

export const dynamic = "force-dynamic";

interface CampaignPageProps {
  params: Promise<{ campaignId: string }>;
}

function CharacterCard({ character }: { character: Character }) {
  const copy = getMessages().characters;

  return (
    <article className="character-card">
      <div className="character-card-heading">
        <div>
          <p className="character-archetype">
            {copy.archetypes[character.archetype]}
          </p>
          <h3>{character.name}</h3>
        </div>
        <Link
          className="text-link"
          href={`/campaigns/${character.campaignId}/characters/${character.id}/edit`}
        >
          {copy.editLink}
        </Link>
      </div>
      <p className="character-concept">{character.concept}</p>
      <ul className="character-traits" aria-label={copy.traitsLabel}>
        {character.traits.map((trait) => (
          <li key={trait}>{trait}</li>
        ))}
      </ul>
      {character.flaw ? (
        <p className="character-flaw">
          <strong>{copy.flawLabel}:</strong> {character.flaw}
        </p>
      ) : null}
    </article>
  );
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) {
    notFound();
  }

  const characters = await characterService.list(campaign.id);
  const messages = getMessages();
  const copy = messages.campaigns;
  const characterCopy = messages.characters;
  const worldCopy = messages.worldEntities;
  const knowledgeCopy = messages.knowledge;
  const chronicleCopy = messages.chronicle;
  const threadCopy = messages.storyThreads;
  const sceneCopy = messages.scenes;
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

      <section className="character-section" aria-labelledby="characters-title">
        <div className="section-heading">
          <div>
            <h2 id="characters-title">{characterCopy.sectionTitle}</h2>
            <p>{characterCopy.sectionDescription}</p>
          </div>
          {campaign.status === "active" ? (
            <Link
              className="button button-primary"
              href={`/campaigns/${campaign.id}/characters/new`}
            >
              {characterCopy.newCharacter}
            </Link>
          ) : null}
        </div>

        {characters.length > 0 ? (
          <div className="character-grid">
            {characters.map((character) => (
              <CharacterCard character={character} key={character.id} />
            ))}
          </div>
        ) : (
          <div className="character-empty">
            <h3>{characterCopy.emptyTitle}</h3>
            <p>{characterCopy.emptyDescription}</p>
          </div>
        )}
      </section>

      <section className="world-entry-section" aria-labelledby="world-title">
        <div>
          <h2 id="world-title">{worldCopy.sectionTitle}</h2>
          <p>{worldCopy.sectionDescription}</p>
        </div>
        <Link
          className="button button-secondary"
          href={`/campaigns/${campaign.id}/world`}
        >
          {worldCopy.openRegistry}
        </Link>
      </section>

      <section className="world-entry-section" aria-labelledby="knowledge-title">
        <div>
          <h2 id="knowledge-title">{knowledgeCopy.sectionTitle}</h2>
          <p>{knowledgeCopy.sectionDescription}</p>
        </div>
        <Link
          className="button button-secondary"
          href={`/campaigns/${campaign.id}/knowledge`}
        >
          {knowledgeCopy.openRegistry}
        </Link>
      </section>

      <section className="world-entry-section" aria-labelledby="chronicle-title">
        <div>
          <h2 id="chronicle-title">{chronicleCopy.sectionTitle}</h2>
          <p>{chronicleCopy.sectionDescription}</p>
        </div>
        <Link
          className="button button-secondary"
          href={`/campaigns/${campaign.id}/chronicle`}
        >
          {chronicleCopy.openChronicle}
        </Link>
      </section>

      <section className="world-entry-section" aria-labelledby="threads-title">
        <div>
          <h2 id="threads-title">{threadCopy.sectionTitle}</h2>
          <p>{threadCopy.sectionDescription}</p>
        </div>
        <Link
          className="button button-secondary"
          href={`/campaigns/${campaign.id}/threads`}
        >
          {threadCopy.openRegistry}
        </Link>
      </section>

      <section className="world-entry-section" aria-labelledby="scenes-title">
        <div>
          <h2 id="scenes-title">{sceneCopy.sectionTitle}</h2>
          <p>{sceneCopy.sectionDescription}</p>
        </div>
        <Link
          className="button button-primary"
          href={`/campaigns/${campaign.id}/scenes`}
        >
          {sceneCopy.openScenes}
        </Link>
      </section>
    </article>
  );
}
