CREATE TABLE "OracleRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "likelihood" TEXT NOT NULL,
    "dieOne" INTEGER NOT NULL,
    "dieTwo" INTEGER NOT NULL,
    "rawTotal" INTEGER NOT NULL,
    "modifier" INTEGER NOT NULL,
    "adjustedTotal" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "isDouble" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OracleRecord_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OracleRecord_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "OracleRecord_sceneId_createdAt_idx" ON "OracleRecord"("sceneId", "createdAt");
CREATE INDEX "OracleRecord_campaignId_createdAt_idx" ON "OracleRecord"("campaignId", "createdAt");
