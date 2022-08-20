import { PlaywrightTestConfig } from '@playwright/test'
const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
  },
  testDir: './e2e',
  testMatch: /.*.e2e.ts/,
  outputDir: 'test-results/',
  webServer: {
    command: 'cross-env NODE_ENV=test yarn dev',
    url: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: process.env.CI === 'true',
    env: {
      NODE_ENV: 'test',
    },
  },
}
export default config
