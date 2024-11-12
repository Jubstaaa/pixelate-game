import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getCategoryBySlug = unstable_cache(
  async (categorySlug) => {
    const category = await prisma.category.findFirst({
      where: {
        slug: categorySlug,
      },
    });
    return category;
  },
  // Specify a unique cache key for this query
  (categorySlug) => ["categoryBySlug", categorySlug], // Cache key is based on categorySlug
  {
    // Set the TTL (time to live) for cache, e.g., 3600 seconds (1 hour)
    revalidate: 3600,
  }
);

export const getCategories = unstable_cache(
  async (args) => {
    const categories = await prisma.category.findMany(args);
    return categories;
  },
  // Cache key function, in this case, we don't need specific parameters, so we can use a static key
  (args) => ["categories", args],
  {
    // Set the TTL (time to live) for cache, e.g., 3600 seconds (1 hour)
    revalidate: 3600,
  }
);
