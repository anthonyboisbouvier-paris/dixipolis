import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Swipeaway (ex-Escapade) vit sur son propre domaine
      { source: "/escapade/:path*", destination: "https://swipeaway.app/escapade/:path*", permanent: true },
      { source: "/api/escapade", destination: "https://swipeaway.app/api/escapade", permanent: true },
      { source: "/api/escapade-auth", destination: "https://swipeaway.app/api/escapade-auth", permanent: true },
    ];
  },
  /* config options here */
};

export default nextConfig;
