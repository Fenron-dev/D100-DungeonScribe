CREATE TABLE "SceneMessageRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SceneMessageRevision_messageId_fkey"
      FOREIGN KEY ("messageId") REFERENCES "SceneMessage" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "SceneMessageRevision_messageId_createdAt_idx"
ON "SceneMessageRevision"("messageId", "createdAt");

INSERT INTO "SceneMessageRevision" ("id", "messageId", "content", "createdAt")
SELECT lower(hex(randomblob(16))), "id", "content", "createdAt"
FROM "SceneMessage";
