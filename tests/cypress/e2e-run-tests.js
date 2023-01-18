/* eslint-disable @typescript-eslint/no-var-requires */
const cypress = require('cypress')
const glob = require('glob')
const path = require('path')
const { chunk } = require('lodash')

const configFile = path.join(__dirname, '../cypress.config.ts')
const supportFile = path.join(__dirname, './support/e2e.ts')
const fixturesFolder = path.join(__dirname, './fixtures')

glob('./tests/cypress/e2e/**/*.cy.ts', async (err, files) => {
  if (err) {
    process.exit(1)
  }

  const parallelSize = 5 // make sure to adjust strategy.matrix.index also in e2e.yml
  const size = Math.ceil(files.length / parallelSize)
  const group = chunk(files, size)
  const index = process.env.MATRIX || 1
  const specs = group[index - 1]

  try {
    const results = await cypress.run({
      browser: 'chrome',
      configFile,
      config: {
        supportFile,
        e2e: {
          fixturesFolder,
          specPattern: specs,
        },
      },
      quiet: true,
    })

    if (results.totalFailed > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})
