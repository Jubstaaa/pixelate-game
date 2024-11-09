import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Prisma client import
import { Jimp } from "jimp";

export async function GET(req) {
  try {
    const deviceId = req.headers.get("Device-Id"); // Header'dan deviceId alıyoruz

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required." },
        { status: 400 }
      );
    }

    const categoryId = req.nextUrl.searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 }
      );
    }

    const device = await prisma.device.findUnique({
      where: {
        category_id_device_id_level_type: {
          device_id: deviceId,
          category_id: Number(categoryId),
          level_type: 0,
        },
      },
      include: {
        character: true,
      },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Device ID is required." },
        { status: 400 }
      );
    }

    const character = device.character;

    if (!character) {
      return NextResponse.json(
        { error: "No characters found." },
        { status: 404 }
      );
    }

    const characterImage = await prisma.characterImage.findFirst({
      where: {
        character_id: character.id,
        level_type: 0,
        count: device?.count > 6 ? 6 : device?.count || 0,
      },
    });

    const image = await Jimp.read(characterImage.image);

    const pixellatedImageBase64 = await image.getBase64("image/jpeg");

    return NextResponse.json({
      pixellatedImage: pixellatedImageBase64,
    });
  } catch (error) {
    console.error("Error fetching random character:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching a random character." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const deviceId = req.headers.get("Device-Id"); // Header'dan deviceId alıyoruz
    const data = await req.json();

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required." },
        { status: 400 }
      );
    }

    if (!data.categoryId) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 }
      );
    }

    let device;

    device = await prisma.device.findUnique({
      where: {
        category_id_device_id_level_type: {
          device_id: deviceId,
          category_id: data.categoryId,
          level_type: 0,
        },
      },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Device ID is required." },
        { status: 400 }
      );
    }

    if (device.character_id == data.id) {
      const totalCharacters = await prisma.character.findMany({
        where: {
          categoryId: data.categoryId,
        },
        select: {
          id: true,
        },
      });
      const randomIndex = Math.floor(Math.random() * totalCharacters.length); // Rastgele bir index seçiyoruz
      const character = totalCharacters[randomIndex];

      await prisma.device.update({
        where: {
          category_id_device_id_level_type: {
            device_id: deviceId,
            category_id: data.categoryId,
            level_type: 0,
          },
        },
        data: {
          count: 0,
          character_id: character.id,
        },
      });

      return NextResponse.json({ message: "Correct! Let's go" });
    } else {
      await prisma.device.update({
        where: {
          category_id_device_id_level_type: {
            device_id: deviceId,
            category_id: data.categoryId,
            level_type: 0,
          },
        },
        data: {
          count: device.count + 1,
        },
      });
      return NextResponse.json(
        { message: "Come on! Try again!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching random character:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching a random character." },
      { status: 500 }
    );
  }
}
