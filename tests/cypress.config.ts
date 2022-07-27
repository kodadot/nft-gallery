import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:9090',
    fixturesFolder: false,
    video: false,
    screenshotOnRunFailure: false,
  },
  viewportWidth: 1024,
  viewportHeight: 768,
})
