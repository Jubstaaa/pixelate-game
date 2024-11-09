import prisma from "@/lib/prisma";
import { uploadImageToVercelBlob } from "@/lib/blob"; // Vercel Blob fonksiyonu
import { Jimp } from "jimp"; // Jimp kütüphanesi
import { deleteImageFromVercelBlob } from "@/lib/blob"; // Eski resmi silmek için fonksiyon

const getLatestVersion = async () => {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = await response.json();
  return versions[0];
};

export const getLatestChampions = async () => {
  try {
    const latestVersion = await getLatestVersion();
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
    );

    if (!response.ok) {
      throw new Error(`Error fetching champions: ${response.statusText}`);
    }

    const { data } = await response.json();

    for (const champ of Object.values(data)) {
      const { id, key, name } = champ;

      const championImageUrl = `https://cdn.communitydragon.org/latest/champion/${key}/square`;

      const image = await Jimp.read(championImageUrl);

      const imageBuffer = await image
        .crop({
          x: 5,
          y: 5,
          w: image.bitmap.width - 10,
          h: image.bitmap.height - 10,
        })
        .resize({ w: 128 })
        .getBuffer("image/jpeg");

      const existingChampion = await prisma.character.findFirst({
        where: { name },
        include: {
          characterImages: true,
        },
      });

      if (existingChampion?.championImages?.length > 0) {
        for (const item of existingChampion.championImages) {
          await deleteImageFromVercelBlob(item.image);
        }
      }

      const images = [];
      for (let index = 7; index > 0; index--) {
        const imageClone = await Jimp.read(imageBuffer); // create a clone of the cropped image

        const pixellatedImageBuffer = await imageClone
          .pixelate((index - 1) * 4 + 1)
          .getBuffer("image/jpeg");
        const uploadedImageUrl = await uploadImageToVercelBlob(
          pixellatedImageBuffer,
          `${key}-${index}.webp`
        );

        images.push({
          count: 7 - index,
          image: uploadedImageUrl,
          character_id: existingChampion?.id,
          level_type: 0,
        });
      }

      for (let index = 7; index > 0; index--) {
        const imageClone = await Jimp.read(imageBuffer); // create a clone of the cropped image

        const pixellatedImageBuffer = await imageClone
          .pixelate((index - 1) * 4 + 1)
          .greyscale()
          .getBuffer("image/jpeg");
        const uploadedImageUrl = await uploadImageToVercelBlob(
          pixellatedImageBuffer,
          `${key}-${index}.webp`
        );

        images.push({
          count: 7 - index,
          image: uploadedImageUrl,
          character_id: existingChampion?.id,
          level_type: 1,
        });
      }

      if (existingChampion) {
        await prisma.character.update({
          where: { id: existingChampion.id },
          data: { name, categoryId: 1 },
        });

        for (const img of images) {
          await prisma.characterImage.upsert({
            where: {
              count_character_id_level_type: {
                count: img.count,
                character_id: existingChampion.id,
                level_type: img.level_type,
              },
            },
            update: { image: img.image },
            create: {
              character_id: existingChampion.id,
              count: img.count,
              image: img.image,
              level_type: img.level_type,
            },
          });
        }
      } else {
        const newChampion = await prisma.character.create({
          data: { name, categoryId: 1 },
        });

        for (const img of images) {
          await prisma.characterImage.create({
            data: {
              character_id: newChampion.id,
              count: img.count,
              image: img.image,
              level_type: img.level_type,
            },
          });
        }
      }
    }

    console.log("Champions updated successfully!");
  } catch (error) {
    console.error("An error occurred while updating champions:", error);
  }
};
