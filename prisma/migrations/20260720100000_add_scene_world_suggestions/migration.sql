CREATE TABLE "SceneWorldSuggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdEntityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "SceneWorldSuggestion_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SceneWorldSuggestion_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SceneWorldSuggestion_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "SceneMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "SceneWorldSuggestion_sceneId_status_createdAt_idx" ON "SceneWorldSuggestion"("sceneId", "status", "createdAt");
CREATE INDEX "SceneWorldSuggestion_campaignId_status_idx" ON "SceneWorldSuggestion"("campaignId", "status");
CREATE INDEX "SceneWorldSuggestion_messageId_idx" ON "SceneWorldSuggestion"("messageId");
