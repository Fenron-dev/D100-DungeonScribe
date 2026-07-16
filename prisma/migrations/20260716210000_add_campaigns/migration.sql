-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "premise" TEXT NOT NULL,
    "genre" TEXT,
    "mood" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "archivedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CampaignEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "timestampReal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "reversible" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CampaignEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Campaign_status_updatedAt_idx" ON "Campaign"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "CampaignEvent_campaignId_timestampReal_idx" ON "CampaignEvent"("campaignId", "timestampReal");
