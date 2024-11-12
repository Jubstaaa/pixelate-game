import GuessCharacterGame from "@/components/Game";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";

import { getCategoryBySlug } from "@/lib/category";
import { getTotalCharacters } from "@/lib/character";
import { getCharacterImage } from "@/lib/characterImage";
import { getDevice } from "@/lib/device";

export async function generateMetadata({ params }) {
  const categorySlug = (await params).categorySlug;

  const category = await getCategoryBySlug(categorySlug);

  return {
    title: `Pixel Guess: ${category.name} Category | Hard Mode`,
    description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category. Choose your challenge and start guessing!`,
  };
}

async function page({ params }) {
  const level_type = 1;

  const categorySlug = (await params).categorySlug;

  const category = await getCategoryBySlug(categorySlug);

  const cookieStore = await cookies();
  const deviceId = cookieStore.get("device-id");
  let device;

  let options = {};

  if (cookieStore.get("options")) {
    options = JSON.parse(cookieStore.get("options").value);
  }

  device = await getDevice(deviceId.value, category.id, 1);

  const totalCharacters = await getTotalCharacters(category.id);

  if (!device) {
    const randomIndex = Math.floor(Math.random() * totalCharacters.length); // Rastgele bir index seçiyoruz
    const character = totalCharacters[randomIndex];

    device = await prisma.device.create({
      data: {
        device_id: deviceId.value,
        category_id: category.id,
        level_type: level_type,
        character_id: character.id,
      },
    });
  }

  const pixellatedImageBase64 = await getCharacterImage(
    device.character_id,
    device?.count,
    level_type,
    options
  );

  return (
    <GuessCharacterGame
      level_type={level_type}
      categoryId={category.id}
      pixellatedImageBase64={pixellatedImageBase64}
      categoryCharacters={totalCharacters.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.characterImages.find(
          (img) => img.count === 6 && img.level_type === 0
        )?.image,
      }))}
    />
  );
}

export default page;
