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

  let character;

  if (!deviceScore) {
    character = await prisma.character.findFirst({
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
  } else {
    character = await prisma.character.findUnique({
      where: {
        id: deviceScore.character_id,
      },
    });
  }
  console.log(character.name);
  return {
    count: deviceScore.count,
    characterImage: character.characterImage,
    streak: deviceScore.streak,
    maxStreak: deviceScore.maxStreak,
  };
}
