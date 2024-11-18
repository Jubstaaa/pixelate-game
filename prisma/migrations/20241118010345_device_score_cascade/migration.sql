-- DropForeignKey
ALTER TABLE "DeviceScore" DROP CONSTRAINT "DeviceScore_character_id_fkey";

-- AddForeignKey
ALTER TABLE "DeviceScore" ADD CONSTRAINT "DeviceScore_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
