import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

async function handler(req, { params }) {
  const id = parseInt(params.id);

  if (req.method === "PUT") {
    try {
      const body = await req.json();
      const { name, characterImage, categoryId } = body;

      if (!name || !categoryId) {
        return NextResponse.json(
          { error: "Name and category are required" },
          { status: 400 }
        );
      }

      // Verify category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      const character = await prisma.character.update({
        where: { id },
        data: {
          name,
          characterImage,
          categoryId,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json(character);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update character" },
        { status: 500 }
      );
    }
  }

  if (req.method === "DELETE") {
    try {
      // Check if character has any device scores
      const characterWithScores = await prisma.character.findUnique({
        where: { id },
        include: {
          DeviceScore: true,
        },
      });

      if (characterWithScores?.DeviceScore.length) {
        return NextResponse.json(
          { error: "Cannot delete character with associated scores" },
          { status: 400 }
        );
      }

      await prisma.character.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete character" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);
