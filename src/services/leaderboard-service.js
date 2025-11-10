"use server";

import prisma from "@/lib/prisma";

const USERNAME_SUCCESS_MESSAGE = (username) => `Welcome to the ranking, ${username}!`;
const USERNAME_TAKEN_MESSAGE = "Username is already taken.";
const DEVICE_NOT_FOUND_MESSAGE = "Device not found.";
const USERNAME_ALREADY_SET_MESSAGE = "Username is already set.";

export async function updateUsername(deviceId, username) {
  if (!deviceId) {
    throw new Error(DEVICE_NOT_FOUND_MESSAGE);
  }

  try {
    const device = await prisma.device.findUnique({
      where: {
        device_id: deviceId,
      },
    });

    if (!device) {
      throw new Error(DEVICE_NOT_FOUND_MESSAGE);
    }

    if (device.username) {
      throw new Error(USERNAME_ALREADY_SET_MESSAGE);
    }

    await prisma.device.update({
      where: {
        device_id: deviceId,
      },
      data: {
        username,
      },
    });

    return { message: USERNAME_SUCCESS_MESSAGE(username) };
  } catch (error) {
    if (error?.code === "P2002") {
      return { error: USERNAME_TAKEN_MESSAGE };
    }
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getLeaderboard(categoryId, levelType) {
  return prisma.deviceScore.findMany({
    where: {
      category_id: Number(categoryId),
      level_type: Number(levelType),
      device: {
        username: {
          not: null,
        },
      },
    },
    select: {
      device: {
        select: {
          username: true,
        },
      },
      maxStreak: true,
    },
    orderBy: [
      {
        maxStreak: "desc",
      },
    ],
  });
}
