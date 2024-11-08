import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma client import

export async function GET(req) {
  try {
    const champions = await prisma.character.findMany({
      select: {
        id: true,
        name: true,
        characterImages: true,
      },
    });

    return NextResponse.json(
      champions.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.characterImages.at(-1).image,
      }))
    );
  } catch (error) {
    console.error("Error fetching champions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching champions." },
      { status: 500 }
    );
  }
}
