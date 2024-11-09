-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
