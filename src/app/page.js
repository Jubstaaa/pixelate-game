import CategoryCard from "@/components/CategoryCard";
import prisma from "@/lib/prisma";
import { Spacer } from "@nextui-org/react";

export default async function Home() {
  const categories = await prisma.category.findMany();

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-primary">Open Beta!</h2>
        <h1 className="text-4xl font-medium tracking-tight">Pixel Guess</h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Pick your favorite category and try to guess the hidden image pixel by
          pixel!
        </h2>
        <Spacer y={4} />
      </div>

      <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((item) => (
          <CategoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
