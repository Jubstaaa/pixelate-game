import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { withAuth } from "@/lib/auth";

async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // "character" or "category"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || !["character", "category"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type provided" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = `${type}s/${filename}`; // Will create "characters/" or "categories/" folder

    // Upload to Vercel Blob Storage
    const blob = await put(path, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
