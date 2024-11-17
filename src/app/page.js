import { getCategories } from "@/lib/category";
import CategoryCard from "@/components/CategoryCard";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
  description:
    "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Choose your favorite category and start guessing today. Fun and addictive image guessing game for all ages.",
};

export default async function Home() {
  const categories = await getCategories();
  const h = await getTranslations("Hero");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          {h("SubTitle")}
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Pixel Guess
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {h("Description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((item) => (
          <CategoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
