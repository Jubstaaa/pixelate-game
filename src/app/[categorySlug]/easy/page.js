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
    title: `Pixel Guess: ${category.name} Category | Easy Mode`, // Dinamik başlık
    description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category. Choose your challenge and start guessing!`, // Dinamik açıklama
    openGraph: {
      title: `Pixel Guess: ${category.name} Category | Fun Image Guessing Game`,
      description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category.`,
      url: `https://pixelguessgame.com/${categorySlug}/easy`,
      siteName: "Pixel Guess",
      images: [
        {
          url: category.icon, // Kategoriye özel resim
          width: 200,
          height: 200,
          alt: `${category.name} Category: Fun Image Guessing Game`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image", // Twitter için geniş özet kartı
      title: `Pixel Guess: ${category.name} Category | Fun Image Guessing Game`,
      description: `${category.name} Category: Guess hidden images in the ${category.name} category. Challenge yourself!`,
      images: [category.icon], // Kategoriye özel resim
    },
  };
}

async function page({ params }) {
  const level_type = 0;
  const categorySlug = (await params).categorySlug;

  const category = await getCategoryBySlug(categorySlug);

  const cookieStore = await cookies();
  const deviceId = cookieStore.get("device-id");
  let device;

  let options;

  if (cookieStore.get("options")) {
    options = JSON.parse(cookieStore.get("options").value);
  }

  device = await getDevice(deviceId.value, category.id, level_type);

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
      characters={totalCharacters.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.characterImages.find(
          (img) => img.count === 6 && img.level_type === 0
        )?.image,
      }))}
      currentStreak={device.streak}
      highStreak={device.maxStreak}
    />
  );
}

export default page;
