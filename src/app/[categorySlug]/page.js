import GuessCharacterGame from "@/components/Game";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import {
  formatDistanceToNow,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";

async function page() {
  const cookieStore = await cookies();
  const deviceId = cookieStore.get("device-id");
  let device;

  device = await prisma.device.findUnique({
    where: {
      id: deviceId.value,
    },
  });

  if (!device) {
    device = await prisma.device.create({
      data: {
        id: deviceId.value,
      },
    });
  }

  let midnightUTC;

  if (device?.easyCount === 999) {
    const now = new Date();
    midnightUTC = setHours(setMinutes(setSeconds(startOfDay(now), 0), 0), 24); // UTC gece 12
  }

  return (
    <GuessCharacterGame device={device} midnight={midnightUTC?.toISOString()} />
  );
}

export default page;
