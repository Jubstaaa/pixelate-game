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

-- AddForeignKey
ALTER TABLE "PatchNoteLocalization" ADD CONSTRAINT "PatchNoteLocalization_patch_note_id_fkey" FOREIGN KEY ("patch_note_id") REFERENCES "PatchNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatchNoteLocalization" ADD CONSTRAINT "PatchNoteLocalization_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
