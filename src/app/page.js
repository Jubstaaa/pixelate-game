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
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-[48px] font-[900] tracking-[-2px] text-foreground">
          Pixel<span className="text-primary"> Guess</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-[280px] text-[14px] leading-[21px]">
          Pick a category and guess the hidden character pixel by pixel.
        </p>
        <div className="mt-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-[5px]">
          <span className="text-[11px] font-[700] tracking-[1px] text-primary">OPEN BETA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((item) => (
          <CategoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
