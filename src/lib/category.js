import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getCategoryBySlug = unstable_cache(
  async (categorySlug) => {
    const category = await prisma.category.findFirst({
      where: {
        slug: categorySlug,
        isActive: true,
      },
    });
    return category;
  },
  (categorySlug) => ["categoryBySlug", categorySlug],
  {
    revalidate: 3600,
  }
);

export const getCategories = unstable_cache(
  async (args) => {
    const categories = await prisma.category.findMany({
      orderBy: [{ isActive: "desc" }],
    });
    return categories;
  },
  (args) => ["categories", args],
  {
    revalidate: 3600,
  }
);
