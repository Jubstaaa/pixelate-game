/*
  Warnings:

  - You are about to drop the column `easyCount` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `hardCount` on the `Device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[count,character_id,level_type]` on the table `CharacterImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_id,device_id,level_type]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CharacterImage_count_character_id_key";

-- DropIndex
DROP INDEX "Device_category_id_device_id_key";

-- AlterTable
ALTER TABLE "CharacterImage" ADD COLUMN     "level_type" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "easyCount",
DROP COLUMN "hardCount",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level_type" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "CharacterImage_count_character_id_level_type_key" ON "CharacterImage"("count", "character_id", "level_type");

-- CreateIndex
CREATE UNIQUE INDEX "Device_category_id_device_id_level_type_key" ON "Device"("category_id", "device_id", "level_type");
