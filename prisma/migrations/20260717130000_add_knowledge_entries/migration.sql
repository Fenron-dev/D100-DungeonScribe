-- CreateTable
CREATE TABLE "KnowledgeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "truthStatus" TEXT NOT NULL,
    "knownByCharacterIds" JSONB NOT NULL,
    "relatedEntityIds" JSONB NOT NULL,
    "sourceEventId" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KnowledgeEntry_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "KnowledgeEntry_campaignId_type_updatedAt_idx" ON "KnowledgeEntry"("campaignId", "type", "updatedAt");
