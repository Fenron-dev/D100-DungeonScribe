CREATE TABLE "OracleRandomEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "context" TEXT,
    "trigger" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "affectedEntityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OracleRandomEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OracleRandomEvent_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "OracleRandomEvent_sceneId_createdAt_idx" ON "OracleRandomEvent"("sceneId", "createdAt");
CREATE INDEX "OracleRandomEvent_campaignId_createdAt_idx" ON "OracleRandomEvent"("campaignId", "createdAt");
