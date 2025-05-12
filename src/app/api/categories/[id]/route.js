import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function handler(req, { params }) {
  const id = parseInt(params.id);

  if (req.method === "PUT") {
    try {
      const body = await req.json();
      const { name, slug, icon, isActive } = body;

      if (!name || !slug) {
        return NextResponse.json(
          { error: "Name and slug are required" },
          { status: 400 }
        );
      }

      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          slug,
          icon,
          isActive,
        },
      });

      return NextResponse.json(category);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      );
    }
  }

  if (req.method === "DELETE") {
    try {
      // Check if category has any characters
      const categoryWithCharacters = await prisma.category.findUnique({
        where: { id },
        include: {
          characters: true,
        },
      });

      if (categoryWithCharacters?.characters.length) {
        return NextResponse.json(
          { error: "Cannot delete category with associated characters" },
          { status: 400 }
        );
      }

      await prisma.category.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);
