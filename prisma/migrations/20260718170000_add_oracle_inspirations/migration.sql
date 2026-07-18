CREATE TABLE "OracleInspiration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "question" TEXT,
    "primaryCategory" TEXT NOT NULL,
    "primaryTermId" TEXT NOT NULL,
    "secondaryCategory" TEXT NOT NULL,
    "secondaryTermId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OracleInspiration_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OracleInspiration_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "OracleInspiration_sceneId_createdAt_idx" ON "OracleInspiration"("sceneId", "createdAt");
CREATE INDEX "OracleInspiration_campaignId_createdAt_idx" ON "OracleInspiration"("campaignId", "createdAt");
