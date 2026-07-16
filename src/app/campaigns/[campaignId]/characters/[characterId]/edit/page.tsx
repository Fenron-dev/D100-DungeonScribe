import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCharacterAction } from "@/features/characters/actions";
import { CharacterForm } from "@/features/characters/character-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";

export const dynamic = "force-dynamic";

interface EditCharacterPageProps {
  params: Promise<{ campaignId: string; characterId: string }>;
}

export default async function EditCharacterPage({
  params,
}: EditCharacterPageProps) {
  const { campaignId, characterId } = await params;
  const [campaign, character] = await Promise.all([
    campaignService.findById(campaignId),
    characterService.findById(campaignId, characterId),
  ]);
  if (!campaign || !character) {
    notFound();
  }

  const messages = getMessages();
  const copy = messages.characters;
  const action = updateCharacterAction.bind(null, campaign.id, character.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}`}>
        <span aria-hidden="true">←</span> {copy.backToCampaign}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.editTitle}</h1>
        <p>{copy.editDescription}</p>
      </header>
      <CharacterForm
        action={action}
        character={character}
        messages={messages}
        mode="edit"
      />
    </div>
  );
}
