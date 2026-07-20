export interface CharacterInventoryDraft {
  itemId: string;
  quantity: number;
  equipped: boolean;
  notes: string;
}

export type CharacterInventoryUpdate = Omit<CharacterInventoryDraft, "itemId">;

export interface CharacterInventoryEntry extends CharacterInventoryDraft {
  id: string;
  campaignId: string;
  characterId: string;
  itemName: string;
  itemSummary: string;
  createdAt: Date;
  updatedAt: Date;
}
