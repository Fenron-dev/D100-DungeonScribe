-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "locationId" TEXT,
    "expectedSetup" TEXT NOT NULL,
    "actualSetup" TEXT NOT NULL,
    "objective" TEXT,
    "participantCharacterIds" JSONB NOT NULL,
    "participantEntityIds" JSONB NOT NULL,
    "relevantThreadIds" JSONB NOT NULL,
    "summary" TEXT,
    "startedAtReal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAtReal" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scene_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Scene_campaignId_status_startedAtReal_idx" ON "Scene"("campaignId", "status", "startedAtReal");

-- Enforce at most one active scene per campaign.
CREATE UNIQUE INDEX "Scene_one_active_per_campaign" ON "Scene"("campaignId") WHERE "status" = 'active';
