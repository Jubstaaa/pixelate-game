import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getLanguages = unstable_cache(
  async () => {
    const languages = await prisma.language.findMany();
    return languages;
  },
  // Specify a unique cache key for this query
  ["languages"], // you can use a unique identifier here to prevent cache conflicts
  {
    // Set the TTL (time to live) for cache, e.g., 3600 seconds (1 hour)
    revalidate: 3600,
  }
);
