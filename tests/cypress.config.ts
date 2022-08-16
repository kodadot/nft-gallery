import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:9090',
    fixturesFolder: 'cypress/fixtures',
    video: false,
    screenshotOnRunFailure: false,
    retries: {
      runMode: 3,
      openMode: 3,
    },
    defaultCommandTimeout: 10000,
  },
  viewportWidth: 1366,
  viewportHeight: 768,
})
