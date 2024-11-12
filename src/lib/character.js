import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getTotalCharacters = unstable_cache(
  async (categoryId) => {
    const totalCharacters = await prisma.character.findMany({
      where: {
        categoryId: categoryId,
      },
      select: {
        id: true,
        name: true,
        characterImages: true,
      },
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
    return totalCharacters;
  },
  // Specify a unique cache key for this query
  ["totalCharacters"], // you can use a unique identifier here to prevent cache conflicts
  {
    // Set the TTL (time to live) for cache, e.g., 3600 seconds (1 hour)
    revalidate: 3600,
  }
);
