import { permanentRedirect } from "next/navigation";

async function page({ params }) {
  const categorySlug = (await params).categorySlug;

  permanentRedirect(`/${categorySlug}/easy`);
}

export default page;
