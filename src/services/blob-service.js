"use server";

import { put, del } from "@vercel/blob";

export async function uploadImage(buffer, fileName, folder = "characters") {
  try {
    const { url } = await put(`${folder}/${fileName}`, buffer, {
      access: "public",
    });

    return url;
  } catch (error) {
    console.error(`Error uploading ${fileName} to Vercel Blob:`, error);
    return null;
  }
}

export async function deleteImage(url) {
  try {
    await del(url);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
