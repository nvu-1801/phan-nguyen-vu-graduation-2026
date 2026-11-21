import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

export default defineConfig([
  ...next,
  ...typescript,
  { rules: { "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_" }] } },
  globalIgnores([".next/**", "next-env.d.ts", "vendor/**", "playwright-report/**", "test-results/**"]),
]);
