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
  ["totalCharacters"],
  {
    revalidate: 3600,
  }
);
