import withPWA from "next-pwa";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    domains: ["btrohbxtyfzgeioyonez.supabase.co"],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
      allowedOrigins: ["*"],
    },
  },
};

const pwaConfig = {
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);
