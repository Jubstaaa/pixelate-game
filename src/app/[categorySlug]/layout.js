import Header from "@/components/Header";
import { getCategoryBySlug } from "@/lib/category";
import { getDevice } from "@/lib/device";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootLayout({ children, params }) {
  const categorySlug = (await params).categorySlug;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }
  const cookieStore = await cookies();

  const deviceId = cookieStore.get("device-id");

  let device;

  device = await getDevice(deviceId.value);

  return (
    <>
      <Header category={category} username={device?.username} />
      {children}
    </>
  );
}
