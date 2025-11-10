/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatchNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatchNoteLocalization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatchNoteLocalization" DROP CONSTRAINT "PatchNoteLocalization_language_id_fkey";

-- DropForeignKey
ALTER TABLE "PatchNoteLocalization" DROP CONSTRAINT "PatchNoteLocalization_patch_note_id_fkey";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "PatchNote";

-- DropTable
DROP TABLE "PatchNoteLocalization";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";
