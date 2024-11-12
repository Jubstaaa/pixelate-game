// app/api/champions/update/route.js

import { getLatestNarutoCharacters } from "@/lib/getLatestNarutoCharacters";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Şampiyonları güncelle
    await getLatestNarutoCharacters();

    return NextResponse.json({ message: "Champions updated successfully!" });
  } catch (error) {
    console.error("Error updating champions:", error);
    return NextResponse.json(
      { error: "An error occurred while updating champions." },
      { status: 500 }
    );
  }
}