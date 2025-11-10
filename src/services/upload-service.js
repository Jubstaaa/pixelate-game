"use server";

import { BlobService } from "./blob-service";

export class UploadService {
  static async uploadFile(file, type) {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!type || !["character", "category"].includes(type)) {
      throw new Error("Invalid type provided. Must be 'character' or 'category'");
    }

    const filename = `${Date.now()}-${file.name}`;
    const folder = `${type}s`;

    const url = await BlobService.uploadImage(file, filename, folder);

    if (!url) {
      throw new Error("Failed to upload file");
    }

    return { url };
  }
}
