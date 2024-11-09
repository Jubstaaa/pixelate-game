/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id,device_id]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_id` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
DROP COLUMN "id",
ADD COLUMN     "category_id" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "character_id" INTEGER,
ADD COLUMN     "device_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device_category_id_device_id_key" ON "Device"("category_id", "device_id");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
