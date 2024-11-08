/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "createdAt",
DROP COLUMN "image",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "CharacterImage" (
    "count" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterImage_count_character_id_key" ON "CharacterImage"("count", "character_id");
