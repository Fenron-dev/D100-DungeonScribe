CREATE TABLE "CampaignStylePreset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseTemplateId" TEXT NOT NULL,
    "style" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "CampaignStylePreset_name_key" ON "CampaignStylePreset"("name");
CREATE INDEX "CampaignStylePreset_updatedAt_idx" ON "CampaignStylePreset"("updatedAt");
