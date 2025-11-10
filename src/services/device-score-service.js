"use server";

import prisma from "@/lib/prisma";

export async function getScore(deviceId, categoryId, levelType) {
  let deviceScore = await prisma.deviceScore.findUnique({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceId,
        category_id: Number(categoryId),
        level_type: Number(levelType),
      },
    },
  });

  const charactersCount = await prisma.character.count({
    where: {
      categoryId: Number(categoryId),
    },
  });

  if (charactersCount === 0) {
    throw new Error("No characters found for the selected category.");
  }

  let character;

  if (!deviceScore) {
    character = await prisma.character.findFirst({
      where: {
        categoryId: Number(categoryId),
      },
      skip: Math.floor(Math.random() * charactersCount),
    });

    deviceScore = await prisma.deviceScore.create({
      data: {
        device_id: deviceId,
        category_id: Number(categoryId),
        level_type: Number(levelType),
        character_id: character.id,
      },
    });
  } else {
    character = await prisma.character.findUnique({
      where: {
        id: deviceScore.character_id,
      },
    });

    if (!character) {
      character = await prisma.character.findFirst({
        where: {
          categoryId: Number(categoryId),
        },
        skip: Math.floor(Math.random() * charactersCount),
      });

      if (character) {
        await prisma.deviceScore.update({
          where: {
            category_id_device_id_level_type: {
              device_id: deviceId,
              category_id: Number(categoryId),
              level_type: Number(levelType),
            },
          },
          data: {
            character_id: character.id,
          },
        });
      }
    }
  }

  return {
    count: deviceScore.count,
    characterImage: character?.characterImage ?? null,
    streak: deviceScore.streak,
    maxStreak: deviceScore.maxStreak,
  };
}
