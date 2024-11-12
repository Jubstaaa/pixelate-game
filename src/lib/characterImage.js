import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { Jimp } from "jimp";

export const getCharacterImage = unstable_cache(
  async (characterId, count, level_type) => {
    const characterImage = await prisma.characterImage.findFirst({
      where: {
        character_id: characterId,
        level_type: level_type,
        count: count > 6 ? 6 : count || 0, // Ensure count doesn't exceed 6, fallback to 0 if undefined
      },
    });

    const image = await Jimp.read(characterImage.image);

    const pixellatedImageBase64 = await image.getBase64("image/jpeg");

    return pixellatedImageBase64;
  },
  // Cache key is based on character_id and count (to handle different devices)
  (characterId, options, level_type) => [
    "characterImage",
    characterId,
    options?.count,
    options?.key,
    level_type,
  ],
  {
    // Set the TTL (time to live) for cache, e.g., 3600 seconds (1 hour)
    revalidate: 3600,
  }
);
