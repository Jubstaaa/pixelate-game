"use server";

import * as CharacterService from "./character-service";
import * as DeviceScoreService from "./device-score-service";
import * as DeviceService from "./device-service";

import prisma from "@/lib/prisma";

const CORRECT_GUESS_MESSAGE = "Correct! Let's go!";
const INCORRECT_GUESS_MESSAGE = "Come on! Try again!";

/**
 * Game Service Functions
 * Handles all business logic related to game mechanics
 */

export async function getGameData(categoryId, levelType, deviceId) {
  if (!deviceId) {
    throw new Error("Device ID is required");
  }

  await DeviceService.findOrCreate(deviceId);

  return DeviceScoreService.getScore(deviceId, Number(categoryId), Number(levelType));
}

export async function submitGuess(characterId, categoryId, levelType, deviceId) {
  if (!deviceId) {
    throw new Error("Device ID is required");
  }

  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  const deviceScore = await prisma.deviceScore.findUnique({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceId,
        category_id: Number(categoryId),
        level_type: Number(levelType),
      },
    },
  });

  if (!deviceScore) {
    throw new Error("No Device Found");
  }

  const isCorrect = deviceScore.character_id === Number(characterId);

  return isCorrect
    ? handleCorrectGuess(deviceScore, categoryId)
    : handleIncorrectGuess(deviceScore);
}

export async function handleCorrectGuess(deviceScore, categoryId) {
  const character = await CharacterService.findRandomByCategory(Number(categoryId));
  if (!character) {
    throw new Error("No characters found for the selected category.");
  }

  const newStreak = deviceScore.streak + 1;
  const updateData = {
    count: 0,
    streak: newStreak,
    character_id: character.id,
  };

  if (newStreak > deviceScore.maxStreak) {
    updateData.maxStreak = newStreak;
  }

  await prisma.deviceScore.update({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceScore.device_id,
        category_id: deviceScore.category_id,
        level_type: deviceScore.level_type,
      },
    },
    data: updateData,
  });

  return { message: CORRECT_GUESS_MESSAGE, isError: false };
}

export async function handleIncorrectGuess(deviceScore) {
  const updateData = {
    count: deviceScore.count + 1,
    streak: 0,
  };

  if (deviceScore.streak > deviceScore.maxStreak) {
    updateData.maxStreak = deviceScore.streak;
  }

  await prisma.deviceScore.update({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceScore.device_id,
        category_id: deviceScore.category_id,
        level_type: deviceScore.level_type,
      },
    },
    data: updateData,
  });

  return { message: INCORRECT_GUESS_MESSAGE, isError: true };
}
