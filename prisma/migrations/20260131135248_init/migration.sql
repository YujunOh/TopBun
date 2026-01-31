-- CreateTable
CREATE TABLE "Burger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "brand" TEXT NOT NULL,
    "brandEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "imageUrl" TEXT NOT NULL DEFAULT '/images/default-burger.svg',
    "eloRating" REAL NOT NULL DEFAULT 1200,
    "lastEloDelta" REAL NOT NULL DEFAULT 0,
    "matchCount" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'classic',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "burgerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_burgerId_fkey" FOREIGN KEY ("burgerId") REFERENCES "Burger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
