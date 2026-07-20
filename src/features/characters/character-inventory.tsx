import Link from "next/link";
import type { CharacterInventoryEntry } from "@/domain/character-inventory";
import type { WorldEntity } from "@/domain/world-entity";
import {
  addCharacterInventoryAction,
  removeCharacterInventoryAction,
  updateCharacterInventoryAction,
} from "@/features/characters/actions";
import type { getMessages } from "@/i18n/messages";

export function CharacterInventory({
  campaignId,
  characterId,
  entries,
  items,
  messages,
}: {
  campaignId: string;
  characterId: string;
  entries: CharacterInventoryEntry[];
  items: WorldEntity[];
  messages: ReturnType<typeof getMessages>;
}) {
  const copy = messages.characters;
  const assignedIds = new Set(entries.map(({ itemId }) => itemId));
  const availableItems = items.filter(({ id }) => !assignedIds.has(id));
  const addAction = addCharacterInventoryAction.bind(null, campaignId, characterId);
  return (
    <section className="character-inventory" aria-labelledby="character-inventory-title">
      <header className="section-heading">
        <div>
          <h2 id="character-inventory-title">{copy.inventoryTitle}</h2>
          <p>{copy.inventoryDescription}</p>
        </div>
      </header>

      {entries.length > 0 ? (
        <div className="inventory-list">
          {entries.map((entry) => {
            const updateAction = updateCharacterInventoryAction.bind(
              null,
              campaignId,
              characterId,
              entry.id,
            );
            const removeAction = removeCharacterInventoryAction.bind(
              null,
              campaignId,
              characterId,
              entry.id,
            );
            return (
              <article className="inventory-card" key={entry.id}>
                <div className="inventory-card-copy">
                  <div>
                    <h3>{entry.itemName}</h3>
                    {entry.equipped ? <span className="status-badge status-active">{copy.inventoryEquippedBadge}</span> : null}
                  </div>
                  <p>{entry.itemSummary}</p>
                </div>
                <form action={updateAction} className="inventory-edit-form">
                  <label>
                    {copy.inventoryQuantityLabel}
                    <input defaultValue={entry.quantity} max={999} min={1} name="quantity" required type="number" />
                  </label>
                  <label className="checkbox-label">
                    <input defaultChecked={entry.equipped} name="equipped" type="checkbox" />
                    {copy.inventoryEquippedLabel}
                  </label>
                  <label>
                    {copy.inventoryNotesLabel}
                    <input defaultValue={entry.notes} maxLength={1_000} name="notes" type="text" />
                  </label>
                  <button className="button button-secondary" type="submit">{copy.inventoryUpdateAction}</button>
                </form>
                <form action={removeAction}>
                  <button className="text-button danger-text" type="submit">{copy.inventoryRemoveAction}</button>
                </form>
              </article>
            );
          })}
        </div>
      ) : <p className="empty-copy">{copy.inventoryEmpty}</p>}

      {availableItems.length > 0 ? (
        <form action={addAction} className="inventory-add-form">
          <label>
            {copy.inventoryItemLabel}
            <select defaultValue="" name="itemId" required>
              <option disabled value="">{copy.inventoryItemPlaceholder}</option>
              {availableItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            {copy.inventoryQuantityLabel}
            <input defaultValue={1} max={999} min={1} name="quantity" required type="number" />
          </label>
          <label className="checkbox-label">
            <input name="equipped" type="checkbox" />
            {copy.inventoryEquippedLabel}
          </label>
          <label>
            {copy.inventoryNotesLabel}
            <input maxLength={1_000} name="notes" type="text" />
          </label>
          <button className="button button-primary" type="submit">{copy.inventoryAddAction}</button>
        </form>
      ) : (
        <p className="inventory-no-items">
          {copy.inventoryNoItems} {" "}
          <Link className="text-link" href={`/campaigns/${campaignId}/world/new`}>
            {copy.inventoryCreateItemAction}
          </Link>
        </p>
      )}
    </section>
  );
}
