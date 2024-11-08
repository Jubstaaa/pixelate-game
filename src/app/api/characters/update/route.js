// app/api/characters/update/route.js
import { getLatestCharacters } from "@/lib/getLatestCharacters";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Şampiyonları güncelle
    await getLatestCharacters();

    return NextResponse.json({ message: "Characters updated successfully!" });
  } catch (error) {
    console.error("Error updating characters:", error);
    return NextResponse.json(
      { error: "An error occurred while updating characters." },
      { status: 500 }
    );
  }
}
