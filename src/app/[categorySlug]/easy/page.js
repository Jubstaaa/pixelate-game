import { notFound } from "next/navigation";

import GuessCharacterGame from "@/components/Game/Game";
import * as CategoryService from "@/services/category-service";

export async function generateMetadata({ params }) {
  const categorySlug = (await params).categorySlug;

  const category = await CategoryService.getBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return {
    title: `Pixel Guess: ${category.name} Category | Easy Mode`,
    description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category. Choose your challenge and start guessing!`,
    openGraph: {
      title: `Pixel Guess: ${category.name} Category | Fun Image Guessing Game`,
      description: `${category.name} Category: Test your skills in guessing hidden images pixel by pixel in the ${category.name} category.`,
      url: `https://pixelguessgame.com/${categorySlug}/easy`,
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
  const level_type = 0;
  const categorySlug = (await params).categorySlug;

  const category = await CategoryService.getBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return <GuessCharacterGame level_type={level_type} categoryId={category.id} />;
}

export default page;
