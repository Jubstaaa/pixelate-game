import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getPatchNotes = unstable_cache(
  async (locale) => {
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
        version: true,
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

    return patchNotes.map((patchNote) => ({
      ...patchNote,
      changes: patchNote.patch_note_localizations.map(
        (localization) => localization.change
      ),
    }));
  },
  async (locale) => {
    return ["patchNotes", locale];
  },
  {
    revalidate: 3600,
  }
);
