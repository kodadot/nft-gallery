import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:9090',
    fixturesFolder: 'cypress/fixtures',
    video: false,
    screenshotOnRunFailure: false,
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  viewportWidth: 1024,
  viewportHeight: 768,
})
