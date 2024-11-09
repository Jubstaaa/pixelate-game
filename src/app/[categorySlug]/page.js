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

async function page({ params }) {
  const categorySlug = (await params).categorySlug;

  const category = await prisma.category.findFirst({
    where: {
      slug: categorySlug,
    },
  });

  const cookieStore = await cookies();
  const deviceId = cookieStore.get("device-id");
  let device;

  device = await prisma.device.findUnique({
    where: {
      category_id_device_id: {
        device_id: deviceId.value,
        category_id: category.id,
      },
    },
  });

  if (!device) {
    const totalCharacters = await prisma.character.findMany({
      where: {
        categoryId: category.id,
      },
      select: {
        id: true,
      },
    });
    const randomIndex = Math.floor(Math.random() * totalCharacters.length); // Rastgele bir index seçiyoruz
    const character = totalCharacters[randomIndex];

    device = await prisma.device.create({
      data: {
        device_id: deviceId.value,
        category_id: category.id,
        character_id: character.id,
      },
    });
  }

  return <GuessCharacterGame device={device} categoryId={category.id} />;
}

export default page;
