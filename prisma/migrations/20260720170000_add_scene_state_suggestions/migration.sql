CREATE TABLE "SceneStateSuggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdRecordId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "SceneStateSuggestion_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SceneStateSuggestion_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SceneStateSuggestion_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "SceneMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "SceneStateSuggestion_sceneId_status_createdAt_idx" ON "SceneStateSuggestion"("sceneId", "status", "createdAt");
CREATE INDEX "SceneStateSuggestion_campaignId_status_idx" ON "SceneStateSuggestion"("campaignId", "status");
CREATE INDEX "SceneStateSuggestion_messageId_idx" ON "SceneStateSuggestion"("messageId");
