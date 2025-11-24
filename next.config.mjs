const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lon1.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
