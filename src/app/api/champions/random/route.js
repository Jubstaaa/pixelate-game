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

    const champion = await prisma.character.findFirst({
      where: {
        todayActive: true,
      },
    });

    if (!champion) {
      return NextResponse.json(
        { error: "No champions found." },
        { status: 404 }
      );
    }

    const championImage = await prisma.characterImage.findFirst({
      where: {
        character_id: champion.id,
        count: device?.easyCount > 24 ? 24 : device?.easyCount || 0,
      },
    });

    const image = await Jimp.read(championImage.image);

    const pixellatedImageBase64 = await image.getBase64("image/jpeg");

    return NextResponse.json({
      pixellatedImage: pixellatedImageBase64,
    });
  } catch (error) {
    console.error("Error fetching random champion:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching a random champion." },
      { status: 500 }
    );
  }
}
