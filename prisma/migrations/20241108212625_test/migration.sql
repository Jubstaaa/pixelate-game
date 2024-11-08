/*
  Warnings:

  - You are about to drop the `CategoryLocalization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryLocalization" DROP CONSTRAINT "CategoryLocalization_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "slug" TEXT;

-- DropTable
DROP TABLE "CategoryLocalization";
