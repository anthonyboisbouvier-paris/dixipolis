import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Escapade a déménagé sur sa propre infrastructure
      { source: "/escapade/:path*", destination: "https://escapade-mocha.vercel.app/escapade/:path*", permanent: true },
      { source: "/api/escapade", destination: "https://escapade-mocha.vercel.app/api/escapade", permanent: true },
      { source: "/api/escapade-auth", destination: "https://escapade-mocha.vercel.app/api/escapade-auth", permanent: true },
    ];
  },
  /* config options here */
};

export default nextConfig;
