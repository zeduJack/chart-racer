import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone-Output für kleinere Docker-Images
  output: "standalone",

  // Externe Pakete die nicht gebundelt werden sollen (native modules)
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
