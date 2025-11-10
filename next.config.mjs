const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.DO_SPACES_URL,
      },
    ],
  },
};

export default nextConfig;
