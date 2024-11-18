-- DropForeignKey
ALTER TABLE "CharacterImage" DROP CONSTRAINT "CharacterImage_character_id_fkey";

-- AddForeignKey
ALTER TABLE "CharacterImage" ADD CONSTRAINT "CharacterImage_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
