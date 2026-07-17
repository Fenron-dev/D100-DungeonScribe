import Link from "next/link";
import { notFound } from "next/navigation";
import { updateWorldEntityAction } from "@/features/world-entities/actions";
import {
  createWorldEntityRelationAction,
  removeWorldEntityRelationAction,
} from "@/features/world-entities/relation-actions";
import { RelationForm } from "@/features/world-entities/relation-form";
import { WorldEntityForm } from "@/features/world-entities/world-entity-form";
import { getMessages } from "@/i18n/messages";
import { campaignService } from "@/services/campaign-service-instance";
import { worldEntityService } from "@/services/world-entity-service-instance";

export const dynamic = "force-dynamic";

interface EditWorldEntityPageProps {
  params: Promise<{ campaignId: string; entityId: string }>;
}

export default async function EditWorldEntityPage({
  params,
}: EditWorldEntityPageProps) {
  const { campaignId, entityId } = await params;
  const [campaign, entity, allEntities, relations] = await Promise.all([
    campaignService.findById(campaignId),
    worldEntityService.findById(campaignId, entityId),
    worldEntityService.list(campaignId),
    worldEntityService.listRelations(campaignId, entityId),
  ]);
  if (!campaign || !entity) {
    notFound();
  }
  const messages = getMessages();
  const copy = messages.worldEntities;
  const action = updateWorldEntityAction.bind(null, campaign.id, entity.id);
  const relationAction = createWorldEntityRelationAction.bind(
    null,
    campaign.id,
    entity.id,
  );
  const removeRelationAction = removeWorldEntityRelationAction.bind(
    null,
    campaign.id,
    entity.id,
  );
  const entityNames = new Map(allEntities.map((item) => [item.id, item.name]));

  return (
    <div className="form-page">
      <Link className="back-link" href={`/campaigns/${campaign.id}/world`}>
        <span aria-hidden="true">←</span> {copy.backToRegistry}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{campaign.name}</p>
        <h1>{copy.editTitle}</h1>
        <p>{copy.editDescription}</p>
      </header>
      <WorldEntityForm
        action={action}
        entity={entity}
        messages={messages}
        mode="edit"
      />
      <section className="relation-section" aria-labelledby="relation-heading">
        <div>
          <h2 id="relation-heading">{copy.relationsTitle}</h2>
          <p>{copy.relationsDescription}</p>
        </div>
        <RelationForm
          action={relationAction}
          entities={allEntities.filter((item) => item.id !== entity.id)}
          messages={messages}
        />
        {relations.length > 0 ? (
          <ul className="relation-list">
            {relations.map((relation) => {
              const isOutgoing = relation.sourceEntityId === entity.id;
              const otherId = isOutgoing
                ? relation.targetEntityId
                : relation.sourceEntityId;
              return (
                <li key={relation.id} className="relation-card">
                  <div>
                    <p className="entity-type">
                      {isOutgoing ? copy.relationOutgoing : copy.relationIncoming}
                    </p>
                    <strong>
                      {isOutgoing ? entity.name : entityNames.get(otherId)} {" "}
                      {copy.relationTypes[relation.type]} {" "}
                      {isOutgoing ? entityNames.get(otherId) : entity.name}
                    </strong>
                    <span className={`entity-status entity-status-${relation.status}`}>
                      {copy.relationStatuses[relation.status]}
                    </span>
                    {relation.description ? <p>{relation.description}</p> : null}
                  </div>
                  <form action={removeRelationAction}>
                    <input type="hidden" name="relationId" value={relation.id} />
                    <button className="text-button danger-text" type="submit">
                      {copy.relationRemoveAction}
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="field-hint">{copy.relationEmpty}</p>
        )}
      </section>
    </div>
  );
}
