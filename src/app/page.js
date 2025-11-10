import CategoryCard from "@/components/CategoryCard";
import * as CategoryService from "@/services/category-service";

export const metadata = {
  title: "Pixel Guess: Guess Hidden Images by Pixel | Fun Image Guessing Game",
  description:
    "Join Pixel Guess and challenge yourself to guess hidden images, pixel by pixel. Choose your favorite category and start guessing today. Fun and addictive image guessing game for all ages.",
};

export default async function Home() {
  const categories = await CategoryService.list();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16 text-center">
        <span className="border-border text-foreground mb-4 inline-flex items-center rounded-md border px-2 py-1 text-xs">
          Open Beta!
        </span>
        <h1 className="from-primary to-secondary mb-6 bg-linear-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Pixel Guess
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Challenge yourself! Pick a category and guess the hidden image pixel by pixel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((item) => (
          <CategoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
