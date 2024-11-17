import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export async function getDeviceScore(deviceId, categoryId, level_type) {
  const device = await prisma.deviceScore.findUnique({
    where: {
      category_id_device_id_level_type: {
        device_id: deviceId,
        category_id: categoryId,
        level_type: level_type,
      },
    },
  });
  return device;
}
