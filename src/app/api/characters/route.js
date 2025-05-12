import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function handler(req) {
  if (req.method === "GET") {
    try {
      const characters = await prisma.character.findMany({
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      return NextResponse.json(characters);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch characters" },
        { status: 500 }
      );
    }
  }

  if (req.method === "POST") {
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

      const character = await prisma.character.create({
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
        { error: "Failed to create character" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
