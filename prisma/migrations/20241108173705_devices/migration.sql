/*
  Warnings:

  - You are about to drop the `Devices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Devices";

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);
