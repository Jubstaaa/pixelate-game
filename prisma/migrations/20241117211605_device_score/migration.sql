/*
  Warnings:

  - You are about to drop the column `category_id` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `character_id` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `level_type` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `maxStreak` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `streak` on the `Device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[device_id]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_character_id_fkey";

-- DropIndex
DROP INDEX "Device_category_id_device_id_level_type_key";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "category_id",
DROP COLUMN "character_id",
DROP COLUMN "count",
DROP COLUMN "level_type",
DROP COLUMN "maxStreak",
DROP COLUMN "streak",
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "DeviceScore" (
    "device_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "character_id" INTEGER,
    "category_id" INTEGER NOT NULL DEFAULT 1,
    "level_type" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceScore_device_id_category_id_level_type_key" ON "DeviceScore"("device_id", "category_id", "level_type");

-- CreateIndex
CREATE UNIQUE INDEX "Device_device_id_key" ON "Device"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_username_key" ON "Device"("username");

-- CreateIndex
CREATE INDEX "Device_device_id_idx" ON "Device"("device_id");

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
