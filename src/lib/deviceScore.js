import prisma from "./prisma";

export async function getDeviceScore(deviceId, categoryId, level_type) {
  let deviceScore = await prisma.deviceScore.findUnique({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceId,
        category_id: categoryId,
        level_type: level_type,
      },
    },
  });

  const charactersCount = await prisma.character.count({
    where: {
      categoryId: categoryId,
    },
  });

  if (!deviceScore) {
    const character = await prisma.character.findFirst({
      where: {
        categoryId: categoryId,
      },

      skip: Math.floor(Math.random() * charactersCount),
    });

    deviceScore = await prisma.deviceScore.create({
      data: {
        device_id: deviceId,
        category_id: categoryId,
        level_type: level_type,
        character_id: character.id,
      },
    });
  }

  const characterImage = await prisma.characterImage.findFirst({
    where: {
      character_id: deviceScore.character_id,
      level_type: level_type,
      count: deviceScore?.count > 6 ? 6 : deviceScore?.count || 0,
    },
  });

  return {
    characterImage: characterImage.image,
    streak: deviceScore.streak,
    maxStreak: deviceScore.maxStreak,
  };
}
