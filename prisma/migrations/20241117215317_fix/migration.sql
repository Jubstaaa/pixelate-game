/*
  Warnings:

  - A unique constraint covering the columns `[category_id,device_id,level_type]` on the table `DeviceScore` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DeviceScore_device_id_category_id_level_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "DeviceScore_category_id_device_id_level_type_key" ON "DeviceScore"("category_id", "device_id", "level_type");
