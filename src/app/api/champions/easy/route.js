import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Prisma client import
import { Jimp } from "jimp";

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

    if (device.easyCount === 999) {
      return NextResponse.json(
        { message: "Already guessed it!" },
        { status: 400 }
      );
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

    if (champion.id == data.id) {
      await prisma.device.update({
        where: {
          id: device.id,
        },
        data: {
          easyCount: 999,
        },
      });

      return NextResponse.json({ message: "Correct! Let's go" });
    } else {
      await prisma.device.update({
        where: {
          id: device.id,
        },
        data: {
          easyCount: device.easyCount + 1,
        },
      });
      return NextResponse.json(
        { message: "Come on! Try again!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching random champion:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching a random champion." },
      { status: 500 }
    );
  }
}
