import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export async function getDevice(deviceId, categoryId, level_type) {
  const device = await prisma.device.findUnique({
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
