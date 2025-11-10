"use server";

import prisma from "@/lib/prisma";

export async function findById(deviceId) {
  if (!deviceId) {
    return null;
  }

  return prisma.device.findUnique({
    where: {
      device_id: deviceId,
    },
  });
}

export async function create(deviceId, data = {}) {
  return prisma.device.create({
    data: {
      device_id: deviceId,
      ...data,
    },
  });
}

export async function findOrCreate(deviceId, data = {}) {
  const existingDevice = await findById(deviceId);

  if (existingDevice) {
    return existingDevice;
  }

  return create(deviceId, data);
}

export async function upsert(deviceId, data = {}) {
  return prisma.device.upsert({
    where: { device_id: deviceId },
    update: data,
    create: { device_id: deviceId, ...data },
  });
}
