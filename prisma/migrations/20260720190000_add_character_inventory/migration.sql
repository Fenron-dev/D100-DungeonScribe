CREATE TABLE "CharacterInventoryEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterInventoryEntry_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterInventoryEntry_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterInventoryEntry_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "WorldEntity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CharacterInventoryEntry_characterId_itemId_key" ON "CharacterInventoryEntry"("characterId", "itemId");
CREATE INDEX "CharacterInventoryEntry_campaignId_characterId_updatedAt_idx" ON "CharacterInventoryEntry"("campaignId", "characterId", "updatedAt");
CREATE INDEX "CharacterInventoryEntry_campaignId_itemId_idx" ON "CharacterInventoryEntry"("campaignId", "itemId");
