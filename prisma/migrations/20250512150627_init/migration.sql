-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "icon" TEXT,
    "name" TEXT,
    "slug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "characterImage" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "device_id" TEXT NOT NULL,
    "username" TEXT
);

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

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "feedback" TEXT,
    "rating" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatchNote" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatchNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatchNoteLocalization" (
    "id" SERIAL NOT NULL,
    "change" TEXT NOT NULL,
    "patch_note_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "PatchNoteLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Device_device_id_key" ON "Device"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_username_key" ON "Device"("username");

-- CreateIndex
CREATE INDEX "Device_device_id_idx" ON "Device"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceScore_category_id_device_id_level_type_key" ON "DeviceScore"("category_id", "device_id", "level_type");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatchNoteLocalization" ADD CONSTRAINT "PatchNoteLocalization_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatchNoteLocalization" ADD CONSTRAINT "PatchNoteLocalization_patch_note_id_fkey" FOREIGN KEY ("patch_note_id") REFERENCES "PatchNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
