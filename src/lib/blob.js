import { put, del } from "@vercel/blob"; // Vercel Blob modülünü import edin

export const uploadImageToVercelBlob = async (imageBuffer, fileName) => {
  try {
    // Şampiyon görselini indir

    // Vercel Blob'a yükle
    const { url } = await put(`characters/${fileName}`, imageBuffer, {
      access: "public", // Görünürlüğü açık yapıyoruz
    });

    return url; // Yüklenen resmin URL'sini döndürüyoruz
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
