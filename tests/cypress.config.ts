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
      openMode: 0,
    },
    defaultCommandTimeout: 10000,
  },
  numTestsKeptInMemory: 1,
  viewportWidth: 1366,
  viewportHeight: 768,
})
