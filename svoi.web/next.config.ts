import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: "s3.regru.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
