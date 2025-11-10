import { notFound } from "next/navigation";

import Header from "@/components/Header/Header";
import * as CategoryService from "@/services/category-service";

export default async function RootLayout({ children, params }) {
  const categorySlug = (await params).categorySlug;
  const category = await CategoryService.getBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Header category={category} />
      {children}
    </>
  );
}
