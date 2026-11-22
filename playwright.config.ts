import { defineConfig } from "@playwright/test";

const port = 3217;
export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
      args: ["--disable-dev-shm-usage", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
  },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: [
    { command: "node scripts/serve-test.mjs 3219 --proxy", url: "http://127.0.0.1:3219/api/health", timeout: 45000 },
    { command: `node scripts/serve-test.mjs ${port}`, url: `http://127.0.0.1:${port}/api/health`, timeout: 45000 },
    { command: "node scripts/serve-test.mjs 3218 --without-db", url: "http://127.0.0.1:3218/", timeout: 45000 },
  ],
});
