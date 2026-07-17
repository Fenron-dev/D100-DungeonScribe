-- CreateTable
CREATE TABLE "StoryThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "premise" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "urgency" INTEGER NOT NULL,
    "progressCurrent" INTEGER NOT NULL DEFAULT 0,
    "progressTarget" INTEGER NOT NULL,
    "relatedEntityIds" JSONB NOT NULL,
    "nextPossibleDevelopments" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoryThread_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StoryThread_campaignId_status_urgency_idx" ON "StoryThread"("campaignId", "status", "urgency");

-- CreateIndex
CREATE INDEX "StoryThread_campaignId_updatedAt_idx" ON "StoryThread"("campaignId", "updatedAt");
