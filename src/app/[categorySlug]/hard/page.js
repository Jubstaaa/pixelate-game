import GuessCharacterGame from "@/components/Game";
import prisma from "@/lib/prisma";
import React from "react";
import { cookies } from "next/headers";
import { getCategoryBySlug } from "@/lib/category";
import { getTotalCharacters } from "@/lib/character";
import { getDeviceScore } from "@/lib/deviceScore";
import { getDevice } from "@/lib/device";
import { getLeaderboard } from "@/lib/leaderboard";

export async function generateMetadata({ params }) {
  const categorySlug = (await params).categorySlug;

  const category = await getCategoryBySlug(categorySlug);

  return {
    title: `Pixel Guess: ${category.name} Category | Hard Mode`,
    description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category. Choose your challenge and start guessing!`,
    openGraph: {
      title: `Pixel Guess: ${category.name} Category | Fun Image Guessing Game`,
      description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category.`,
      url: `https://pixelguessgame.com/${categorySlug}/hard`,
      siteName: "Pixel Guess",
      images: [
        {
          url: category.icon,
          width: 200,
          height: 200,
          alt: `${category.name} Category: Fun Image Guessing Game`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Pixel Guess: ${category.name} Category | Fun Image Guessing Game`,
      description: `${category.name} Category: Guess hidden images in the ${category.name} category. Challenge yourself!`,
      images: [category.icon],
    },
  };
}

async function page({ params }) {
  const level_type = 1;
  const categorySlug = (await params).categorySlug;

  const category = await getCategoryBySlug(categorySlug);

  const cookieStore = await cookies();
  const deviceId = cookieStore.get("device-id");
  let deviceScore;
  let options;
  let device;

  device = await getDevice(deviceId.value);

  if (!device) {
    device = await prisma.device.create({
      data: {
        device_id: deviceId.value,
      },
    });
  }

  if (cookieStore.get("options")) {
    options = JSON.parse(cookieStore.get("options").value);
  }

  deviceScore = await getDeviceScore(deviceId.value, category.id, level_type);

  const totalCharacters = await getTotalCharacters(category.id);

  if (!deviceScore) {
    const randomIndex = Math.floor(Math.random() * totalCharacters.length);
    const character = totalCharacters[randomIndex];

    deviceScore = await prisma.deviceScore.create({
      data: {
        device_id: device.device_id,
        category_id: category.id,
        level_type: level_type,
        character_id: character.id,
      },
    });
  }

  const leaderboard = await getLeaderboard(category.id, level_type);

  return (
    <GuessCharacterGame
      deviceId={device.device_id}
      level_type={level_type}
      categoryId={category.id}
      characters={totalCharacters.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.characterImages.find(
          (img) => img.count === 6 && img.level_type === 0
        )?.image,
      }))}
      currentStreak={deviceScore.streak}
      highStreak={deviceScore.maxStreak}
      leaderboard={leaderboard}
    />
  );
}

export default page;
