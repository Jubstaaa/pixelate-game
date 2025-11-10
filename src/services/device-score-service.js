"use server";

import * as CharacterService from "./character-service";

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

  let character;

  if (!deviceScore) {
    character = await CharacterService.findRandomByCategory(Number(categoryId));
    if (!character) {
      throw new Error("No characters found for the selected category.");
    }

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
      character = await CharacterService.findRandomByCategory(Number(categoryId));

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
