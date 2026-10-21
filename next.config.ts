import type { NextConfig } from "next";

// Static export: the whole site is prerendered to /out.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
