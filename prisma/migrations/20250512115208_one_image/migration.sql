/*
  Warnings:

  - You are about to drop the column `todayActive` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the `CharacterImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharacterImage" DROP CONSTRAINT "CharacterImage_character_id_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "todayActive",
ADD COLUMN     "characterImage" TEXT;

-- DropTable
DROP TABLE "CharacterImage";
