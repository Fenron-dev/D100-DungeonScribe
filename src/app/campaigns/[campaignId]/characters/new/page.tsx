import Link from "next/link";
import { notFound } from "next/navigation";
import { createCharacterAction } from "@/features/characters/actions";
import { CharacterCreationStudio } from "@/features/characters/character-creation-studio";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { getCreativeDraftProviderMode } from "@/services/creative-draft-service-instance";

export const dynamic = "force-dynamic";

interface NewCharacterPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function NewCharacterPage({ params }: NewCharacterPageProps) {
  const { campaignId } = await params;
  const campaign = await campaignService.findById(campaignId);
  if (!campaign) {
    notFound();
  }

  const messages = getMessages();
  const copy = messages.characters;
  const action = createCharacterAction.bind(null, campaign.id);

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}`}>
        <span aria-hidden="true">←</span> {copy.backToCampaign}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.createTitle}</h1>
        <p>{copy.createDescription}</p>
      </header>
      <CharacterCreationStudio
        action={action}
        campaignId={campaign.id}
        messages={messages}
        providerMode={await getCreativeDraftProviderMode()}
      />
    </div>
  );
}
