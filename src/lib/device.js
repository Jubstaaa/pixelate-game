import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getDevice = async (deviceId) => {
  return await prisma.device.findUnique({
    where: {
      device_id: deviceId,
    },
  });
};
