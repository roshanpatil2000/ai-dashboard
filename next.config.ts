import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "aljzxymegqtqeooqkstb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
