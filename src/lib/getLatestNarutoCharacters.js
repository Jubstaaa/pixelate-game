import prisma from "@/lib/prisma";
import { uploadImageToVercelBlob } from "@/lib/blob";
import { Jimp } from "jimp";
import { deleteImageFromVercelBlob } from "@/lib/blob";

const getNarutoCharacters = async () => {
  const response = await fetch(
    "https://narutodb.xyz/api/character?page=1&limit=999999",
    {
      headers: { accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching Naruto characters: ${response.statusText}`);
  }

  const data = await response.json();
  return data.characters;
};

export const getLatestNarutoCharacters = async () => {
  try {
    const characters = await getNarutoCharacters();

    for (const character of characters) {
      const { id, name, images: characterImages } = character;

      if (
        !character.family ||
        !character.jutsu ||
        !character.rank ||
        !character.personal ||
        !character.images.length > 0
      ) {
        continue;
      }

      const imageUrl = characterImages[0];

      const image = await Jimp.read(imageUrl);

      const imageBuffer = await image
        .crop({
          x: 5,
          y: 5,
          w: image.bitmap.width - 10,
          h: image.bitmap.height - 10,
        })
        .resize({ w: 128 })
        .getBuffer("image/jpeg");

      const existingCharacter = await prisma.character.findFirst({
        where: { name: name },
        include: {
          characterImages: true,
        },
      });

      if (existingCharacter?.characterImages?.length > 0) {
        for (const item of existingCharacter.characterImages) {
          await deleteImageFromVercelBlob(item.image);
        }
      }

      const images = [];

      for (let index = 7; index > 0; index--) {
        const imageClone = await Jimp.read(imageBuffer);

        const pixellatedImageBuffer = await imageClone
          .pixelate((index - 1) * 4 + 1)
          .getBuffer("image/jpeg");

        const uploadedImageUrl = await uploadImageToVercelBlob(
          pixellatedImageBuffer,
          `${name}.webp`
        );

        images.push({
          count: 7 - index,
          image: uploadedImageUrl,
          character_id: existingCharacter?.id,
          level_type: 0,
        });
      }

      for (let index = 7; index > 0; index--) {
        const imageClone = await Jimp.read(imageBuffer);

        const pixellatedImageBuffer = await imageClone
          .pixelate((index - 1) * 4 + 1)
          .greyscale()
          .getBuffer("image/jpeg");

        const uploadedImageUrl = await uploadImageToVercelBlob(
          pixellatedImageBuffer,
          `${name}.webp`
        );

        images.push({
          count: 7 - index,
          image: uploadedImageUrl,
          character_id: existingCharacter?.id,
          level_type: 1,
        });
      }

      if (existingCharacter) {
        await prisma.character.update({
          where: { id: existingCharacter.id },
          data: { name: name, categoryId: 3 },
        });

        for (const img of images) {
          await prisma.characterImage.upsert({
            where: {
              count_character_id_level_type: {
                count: img.count,
                character_id: existingCharacter.id,
                level_type: img.level_type,
              },
            },
            update: { image: img.image },
            create: {
              character_id: existingCharacter.id,
              count: img.count,
              image: img.image,
              level_type: img.level_type,
            },
          });
        }
      } else {
        const newCharacter = await prisma.character.create({
          data: { name: name, categoryId: 3 },
        });

        for (const img of images) {
          await prisma.characterImage.create({
            data: {
              character_id: newCharacter.id,
              count: img.count,
              image: img.image,
              level_type: img.level_type,
            },
          });
        }
      }
    }

    console.log("Naruto characters updated successfully!");
  } catch (error) {
    console.error("An error occurred while updating Naruto characters:", error);
  }
};
