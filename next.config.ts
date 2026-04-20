import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // @ts-expect-error - ESLint config for Next.js 16
  eslint: {
    ignoreDuringBuilds: true,
  },
} satisfies NextConfig;

export default nextConfig;
