import { getDeviceScore } from "@/lib/deviceScore";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const searchParams = request.nextUrl.searchParams;
    const deviceId = cookieStore.get("device-id");
    const categoryId = searchParams.get("categoryId") || "";
    const level_type = searchParams.get("level_type") || "";

    const response = await getDeviceScore(
      deviceId.value,
      Number(categoryId),
      Number(level_type)
    );

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request) {
  const g = await getTranslations("Guess");
  const { id, categoryId, level_type } = await request.json();
  const cookieStore = await cookies();
  const deviceId = cookieStore.get("device-id");

  if (!deviceId.value) {
    throw "Device ID is required.";
  }

  if (!categoryId) {
    throw "Category ID is required.";
  }

  const device = await prisma.deviceScore.findUnique({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceId.value,
        category_id: categoryId,
        level_type: level_type,
      },
    },
  });

  if (!device) {
    throw "No Device Found";
  }

  if (device.character_id == id) {
    const charactersCount = await prisma.character.count({
      where: {
        categoryId: categoryId,
      },
    });

    const character = await prisma.character.findFirst({
      where: {
        categoryId: categoryId,
      },

      skip: Math.floor(Math.random() * charactersCount),
    });

    await prisma.deviceScore.update({
      where: {
        category_id_device_id_level_type: {
          device_id: deviceId.value,
          category_id: categoryId,
          level_type: level_type,
        },
      },
      data: {
        count: 0,
        streak: device.streak + 1,
        ...(device.streak + 1 > device.maxStreak && {
          maxStreak: device.streak + 1,
        }),
        character_id: character.id,
      },
    });

    return NextResponse.json({ message: g("ResponseMessage") });
  } else {
    await prisma.deviceScore.update({
      where: {
        category_id_device_id_level_type: {
          device_id: deviceId.value,
          category_id: categoryId,
          level_type: level_type,
        },
      },
      data: {
        count: device.count + 1,
        streak: 0,
        ...(device.streak > device.maxStreak && { maxStreak: device.streak }),
      },
    });

    return NextResponse.json({ message: g("ErrorMessage") }, { status: 400 });
  }
}
