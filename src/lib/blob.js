import { put, del } from "@vercel/blob";

export const uploadImageToVercelBlob = async (imageBuffer, fileName) => {
  try {
    const { url } = await put(`characters/${fileName}`, imageBuffer, {
      access: "public",
    });

    return url;
  } catch (error) {
    console.error(`Error uploading ${fileName} to Vercel Blob:`, error);
    return null;
  }
};

export const deleteImageFromVercelBlob = async (url) => {
  try {
    await del(url);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
