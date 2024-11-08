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

    const device = await prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (!device) {
      await prisma.device.create({
        data: {
          id: deviceId,
        },
      });
    }

    const character = await prisma.character.findFirst({
      where: {
        todayActive: true,
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: "No characters found." },
        { status: 404 }
      );
    }

    const characterImage = await prisma.characterImage.findFirst({
      where: {
        character_id: character.id,
        count: device?.easyCount > 24 ? 24 : device?.easyCount || 0,
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
