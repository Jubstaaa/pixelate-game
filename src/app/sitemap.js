import { getCategories } from "@/lib/category";
import prisma from "@/lib/prisma";

export default async function sitemap() {
  const now = new Date();
  const formattedDate = now.toISOString();
  const categories = await getCategories({
    where: {
      isActive: true,
    },
    select: {
      slug: true,
    },
  });

  return [
    {
      url: "https://pixelguessgame.com",
      priority: 1,
      lastModified: formattedDate,
    },
    ...categories.map((category) => ({
      url: `https://pixelguessgame.com/${category.slug}/easy`,
      lastModified: formattedDate,
      priority: 1,
    })),
    ...categories.map((category) => ({
      url: `https://pixelguessgame.com/${category.slug}/hard`,
      lastModified: formattedDate,
      priority: 1,
    })),
  ];
}
