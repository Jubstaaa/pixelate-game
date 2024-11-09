import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma client import
import { levelTypes } from "@/lib/consts";

export async function GET(req) {
  try {
    const categoryId = req.nextUrl.searchParams.get("categoryId");

    const characters = await prisma.character.findMany({
      where: {
        categoryId: Number(categoryId),
      },
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
        image: item.characterImages.find(
          (img) => img.count === 24 && img.level_type === 0
        )?.image,
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
