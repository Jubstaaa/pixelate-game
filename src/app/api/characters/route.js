import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma client import

export async function GET(req) {
  try {
    const characters = await prisma.character.findMany({
      select: {
        id: true,
        name: true,
        characterImages: true,
      },
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json(
      characters.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.characterImages.find((img) => img.count === 24).image,
      }))
    );
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching characters." },
      { status: 500 }
    );
  }
}
