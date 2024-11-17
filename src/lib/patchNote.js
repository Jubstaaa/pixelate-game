import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { getLocale } from "next-intl/server";

export const getPatchNotes = unstable_cache(
  async (locale) => {
    // Get the current locale from next-intl
    // Query the database for patch notes based on the locale
    const patchNotes = await prisma.patchNote.findMany({
      where: {
        patch_note_localizations: {
          some: {
            language: {
              code: locale,
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        patch_note_localizations: {
          where: {
            language: {
              code: locale,
            },
          },
          select: {
            change: true,
          },
        },
      },
    });

    // Map the patch notes to include the "changes" field
    return patchNotes.map((patchNote) => ({
      ...patchNote,
      changes: patchNote.patch_note_localizations.map(
        (localization) => localization.change
      ),
    }));
  },
  // Dynamically create a cache key based on the locale
  async (locale) => {
    return ["patchNotes", locale]; // Use the locale as part of the cache key
  },
  {
    // Set the TTL (time to live) for cache, e.g., 3600 seconds (1 hour)
    revalidate: 3600,
  }
);
