import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // HF Spaces listens on $PORT (default 7860)
  serverExternalPackages: [],
};

export default nextConfig;
