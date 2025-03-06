import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getLanguages = unstable_cache(
  async () => {
    const languages = await prisma.language.findMany();
    return languages;
  },
  ["languages"],
  {
    revalidate: 3600,
  }
);
