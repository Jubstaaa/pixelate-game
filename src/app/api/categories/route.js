import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function handler(req) {
  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return NextResponse.json(categories);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { name, slug, icon, isActive } = body;

      if (!name || !slug) {
        return NextResponse.json(
          { error: "Name and slug are required" },
          { status: 400 }
        );
      }

      const category = await prisma.category.create({
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
        { error: "Failed to create category" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
