import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'amrax.ai',
      },
      {
        protocol: 'https',
        hostname: 'content-management-files.canva.com',
      },
      {
        protocol: 'https',
        hostname: 'www.rokform.com',
      }
    ],
  },
  // Empty turbopack config to use default behavior
  // .obj files in public folder will be served as static assets automatically
  turbopack: {},
};

export default nextConfig;
