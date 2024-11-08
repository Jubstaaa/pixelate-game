/*
  Warnings:

  - You are about to drop the column `count` on the `Device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "count",
ADD COLUMN     "easyCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hardCount" INTEGER NOT NULL DEFAULT 0;
