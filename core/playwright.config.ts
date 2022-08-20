import { PlaywrightTestConfig } from '@playwright/test'
const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
  },
  testDir: './e2e',
  testMatch: /.*.e2e.ts/,
  outputDir: 'test-results/',
  webServer: {
    command: 'yarn dev',
    url: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: process.env.CI === 'true',
  },
}
export default config
