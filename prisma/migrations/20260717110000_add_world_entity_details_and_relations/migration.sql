ALTER TABLE "WorldEntity" ADD COLUMN "details" JSONB NOT NULL DEFAULT '{}';

CREATE TABLE "WorldEntityRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorldEntityRelation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorldEntityRelation_sourceEntityId_fkey" FOREIGN KEY ("sourceEntityId") REFERENCES "WorldEntity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorldEntityRelation_targetEntityId_fkey" FOREIGN KEY ("targetEntityId") REFERENCES "WorldEntity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "WorldEntityRelation_sourceEntityId_targetEntityId_type_key" ON "WorldEntityRelation"("sourceEntityId", "targetEntityId", "type");
CREATE INDEX "WorldEntityRelation_campaignId_sourceEntityId_idx" ON "WorldEntityRelation"("campaignId", "sourceEntityId");
CREATE INDEX "WorldEntityRelation_campaignId_targetEntityId_idx" ON "WorldEntityRelation"("campaignId", "targetEntityId");
