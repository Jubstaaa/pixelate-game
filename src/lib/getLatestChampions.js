import prisma from "@/lib/prisma";
import { uploadImageToVercelBlob } from "@/lib/blob";
import { v4 as uuidv4 } from "uuid";
import { deleteImageFromVercelBlob } from "@/lib/blob";

const getLatestVersion = async () => {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = await response.json();
  return versions[0];
};

const downloadImage = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
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

      try {
        // Champion resmini indir
        const championImageUrl = `https://cdn.communitydragon.org/latest/champion/${key}/square`;
        const imageBuffer = await downloadImage(championImageUrl);

        // UUID ile benzersiz dosya adı oluştur
        const fileName = `${uuidv4()}.webp`;

        // Resmi Vercel Blob'a yükle
        const blobUrl = await uploadImageToVercelBlob(imageBuffer, fileName);

        // Veritabanına kaydet
        const newChampion = await prisma.character.create({
          data: {
            name,
            categoryId: 1,
            characterImage: blobUrl,
          },
        });

        console.log(
          `Champion ${name} updated successfully with image: ${blobUrl}`
        );
      } catch (error) {
        console.error(`Error processing champion ${name}:`, error);
        // Hata durumunda devam et
        continue;
      }
    }

    console.log("All champions updated successfully!");
  } catch (error) {
    console.error("An error occurred while updating champions:", error);
  }
};
