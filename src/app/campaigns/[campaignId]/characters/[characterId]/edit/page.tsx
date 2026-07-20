import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCharacterAction } from "@/features/characters/actions";
import { CharacterForm } from "@/features/characters/character-form";
import { CharacterInventory } from "@/features/characters/character-inventory";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { characterService } from "@/services/character-service-instance";
import { characterInventoryService } from "@/services/character-inventory-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface EditCharacterPageProps {
  params: Promise<{ campaignId: string; characterId: string }>;
}

export default async function EditCharacterPage({
  params,
}: EditCharacterPageProps) {
  const { campaignId, characterId } = await params;
  const [campaign, character, inventory, entities] = await Promise.all([
    campaignService.findById(campaignId),
    characterService.findById(campaignId, characterId),
    characterInventoryService.list(campaignId, characterId),
    worldEntityService.list(campaignId),
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
      <CharacterInventory
        campaignId={campaign.id}
        characterId={character.id}
        entries={inventory}
        items={entities.filter(({ type }) => type === "item")}
        messages={messages}
      />
    </div>
  );
}
