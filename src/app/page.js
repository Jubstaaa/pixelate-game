import CategoryCard from "@/components/CategoryCard";
import prisma from "@/lib/prisma";

export default async function Home() {
  const categories = await prisma.category.findMany();

  return (
    <div className="grid grid-cols-4 gap-6">
      {categories.map((item) => (
        <CategoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
