import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep resolution rooted in this app (avoid parent-directory lockfile pickup)
    root: path.join(__dirname),
  },
};

export default nextConfig;
