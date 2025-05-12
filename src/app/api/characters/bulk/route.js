import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { characters } = body;

    if (!Array.isArray(characters) || characters.length === 0) {
      return NextResponse.json(
        { error: "Characters array is required" },
        { status: 400 }
      );
    }

    // Validate all characters have required fields
    for (const char of characters) {
      if (!char.name || !char.categoryId) {
        return NextResponse.json(
          { error: "Name and category are required for all characters" },
          { status: 400 }
        );
      }
    }

    // Verify all categories exist
    const categoryIds = [...new Set(characters.map((char) => char.categoryId))];
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: "One or more categories not found" },
        { status: 404 }
      );
    }

    // Create all characters in a transaction
    const createdCharacters = await prisma.$transaction(
      characters.map((char) =>
        prisma.character.create({
          data: {
            name: char.name,
            characterImage: char.characterImage,
            categoryId: char.categoryId,
          },
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        })
      )
    );

    return NextResponse.json(createdCharacters);
  } catch (error) {
    console.error("Bulk create error:", error);
    return NextResponse.json(
      { error: "Failed to create characters" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
