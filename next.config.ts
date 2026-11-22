import type { NextConfig } from "next";

const config: NextConfig = { poweredByHeader: false, output: "standalone", turbopack: { root: process.cwd() }, outputFileTracingRoot: process.cwd(), serverExternalPackages: ["@libsql/client"] };
export default config;
