// app/api/champions/update/route.js
import { getLatestChampions } from "@/lib/getLatestChampions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Şampiyonları güncelle
    await getLatestChampions();

    return NextResponse.json({ message: "Champions updated successfully!" });
  } catch (error) {
    console.error("Error updating champions:", error);
    return NextResponse.json(
      { error: "An error occurred while updating champions." },
      { status: 500 }
    );
  }
}
