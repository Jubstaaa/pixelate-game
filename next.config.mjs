import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wehcews4hiydzgdx.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
