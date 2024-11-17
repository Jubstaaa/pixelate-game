"use server";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { getTranslations } from "next-intl/server";

export const updateUsername = async (username) => {
  const cookieStore = await cookies();
  const t = await getTranslations("Ranking");

  try {
    const deviceId = cookieStore.get("device-id");
    // Önce cihazı kontrol ediyoruz
    const device = await prisma.device.findUnique({
      where: {
        device_id: deviceId.value,
      },
    });

    if (!device) {
      throw "Device not found.";
    }

    if (device.username) {
      throw "Username is already set.";
    }

    // Eğer username null ise güncelle
    await prisma.device.update({
      where: {
        device_id: deviceId.value,
      },
      data: {
        username: username,
      },
    });

    return { message: t("JoinSuccess", { username }) };
  } catch (error) {
    return {
      error,
    };
  }
};

export const getLeaderboard = async (categoryId, level_type) => {
  return await prisma.deviceScore.findMany({
    where: {
      category_id: categoryId,
      level_type: level_type,
      device: {
        username: {
          not: null, // Username'i null olmayanları filtreler
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
        maxStreak: "asc",
      },
    ],
  });
};
