import prisma from "@/lib/prisma";
import { uploadImageToVercelBlob } from "@/lib/blob"; // Vercel Blob fonksiyonu
import { Jimp } from "jimp"; // Jimp kütüphanesi
import { deleteImageFromVercelBlob } from "@/lib/blob"; // Eski resmi silmek için fonksiyon

// Valorant karakterleri API'si
const getValorantCharacters = async () => {
  const response = await fetch("https://valorant-api.com/v1/agents");

  if (!response.ok) {
    throw new Error(
      `Error fetching Valorant characters: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data; // Karakterlerin listesini döndürüyoruz
};

export const getLatestValorantCharacters = async () => {
  try {
    const agents = await getValorantCharacters();

    for (const agent of agents) {
      const { id, displayName, displayIcon } = agent;

      // Karakterin resmi
      const image = await Jimp.read(displayIcon);

      const imageBuffer = await image
        .crop({
          x: 5,
          y: 5,
          w: image.bitmap.width - 10,
          h: image.bitmap.height - 10,
        })
        .resize({ w: 128 })
        .getBuffer("image/jpeg");

      const existingAgent = await prisma.character.findFirst({
        where: { name: displayName },
        include: {
          characterImages: true,
        },
      });

      // Eski görselleri sil
      if (existingAgent?.characterImages?.length > 0) {
        for (const item of existingAgent.characterImages) {
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
          `${displayName}.webp`
        );

        images.push({
          count: 7 - index,
          image: uploadedImageUrl,
          character_id: existingAgent?.id,
          level_type: 0, // Kolay
        });
      }

      // Greyscale versiyonları
      for (let index = 7; index > 0; index--) {
        const imageClone = await Jimp.read(imageBuffer); // create a clone of the cropped image

        const pixellatedImageBuffer = await imageClone
          .pixelate((index - 1) * 4 + 1)
          .greyscale()
          .getBuffer("image/jpeg");
        const uploadedImageUrl = await uploadImageToVercelBlob(
          pixellatedImageBuffer,
          `${displayName}.webp`
        );

        images.push({
          count: 7 - index,
          image: uploadedImageUrl,
          character_id: existingAgent?.id,
          level_type: 1, // Zor
        });
      }

      if (existingAgent) {
        // Eğer karakter mevcutsa güncelle
        await prisma.character.update({
          where: { id: existingAgent.id },
          data: { name: displayName, categoryId: 2 },
        });

        for (const img of images) {
          await prisma.characterImage.upsert({
            where: {
              count_character_id_level_type: {
                count: img.count,
                character_id: existingAgent.id,
                level_type: img.level_type,
              },
            },
            update: { image: img.image },
            create: {
              character_id: existingAgent.id,
              count: img.count,
              image: img.image,
              level_type: img.level_type,
            },
          });
        }
      } else {
        // Eğer karakter bulunmazsa yeni oluştur
        const newAgent = await prisma.character.create({
          data: { name: displayName, categoryId: 2 },
        });

        for (const img of images) {
          await prisma.characterImage.create({
            data: {
              character_id: newAgent.id,
              count: img.count,
              image: img.image,
              level_type: img.level_type,
            },
          });
        }
      }
    }

    console.log("Valorant characters updated successfully!");
  } catch (error) {
    console.error(
      "An error occurred while updating Valorant characters:",
      error
    );
  }
};
