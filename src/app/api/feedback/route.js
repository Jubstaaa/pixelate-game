import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Prisma client import

export async function POST(req) {
  try {
    const data = await req.json();

    await prisma.feedback.create({
      data: data,
    });

    return NextResponse.json({ message: "Thanks for your feedback" });
  } catch (error) {
    console.error("Error fetching random character:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching a random character." },
      { status: 500 }
    );
  }
}
