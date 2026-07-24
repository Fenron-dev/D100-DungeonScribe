CREATE TABLE "LibraryWorldEntity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceEntityId" TEXT NOT NULL,
    "draft" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "LibraryWorldEntity_sourceEntityId_key" ON "LibraryWorldEntity"("sourceEntityId");
CREATE INDEX "LibraryWorldEntity_updatedAt_idx" ON "LibraryWorldEntity"("updatedAt");
