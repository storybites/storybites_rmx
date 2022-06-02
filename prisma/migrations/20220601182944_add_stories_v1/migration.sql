-- CreateTable
CREATE TABLE "Stories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "long" REAL NOT NULL,
    "imageName" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL
);
