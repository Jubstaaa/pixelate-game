import prisma from "@/lib/prisma";
import { uploadImageToVercelBlob } from "@/lib/blob";
import { Jimp } from "jimp";
import { deleteImageFromVercelBlob } from "@/lib/blob";

const getDemonSlayerCharacters = async () => {
  const response = await fetch("https://demon-slayer-api.onrender.com/v1/", {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching DemonSlayer characters: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

export const getLatestDemonSlayerCharacters = async () => {
  try {
    const characters = await getDemonSlayerCharacters();

    for (const character of characters) {
      const { name, image: characterImage } = character;

      const imageUrl = characterImage.split("/revision/")[0];

      console.log(imageUrl);

      if (!imageUrl.includes("Anime")) {
        continue;
      }

      const image = await Jimp.read(imageUrl);

      const imageBuffer = await image
        .crop({
          x: 5,
          y: 5,
          w: image.bitmap.width - 10,
          h: image.bitmap.height - 10,
        })
        .resize({ w: 512 })
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
          .pixelate((index - 1) * 16 + 1)
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
          .pixelate((index - 1) * 16 + 1)
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
          data: { name: name, categoryId: 6 },
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
          data: { name: name, categoryId: 6 },
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

    console.log("DemonSlayer characters updated successfully!");
  } catch (error) {
    console.error(
      "An error occurred while updating DemonSlayer characters:",
      error
    );
  }
};
