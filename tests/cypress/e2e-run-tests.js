/* eslint-disable @typescript-eslint/no-var-requires */
const cypress = require('cypress')
const glob = require('glob')
const path = require('path')
const { chunk } = require('lodash')

const configFile = path.join(__dirname, '../cypress.config.ts')
const supportFile = path.join(__dirname, './support/e2e.ts')
const fixturesFolder = path.join(__dirname, './fixtures')

glob('./tests/cypress/e2e/**/*.cy.ts', async function (err, files) {
  if (err) {
    return process.exit(1)
  }

  const parallelSize = 4
  const size = Math.ceil(files.length / parallelSize)
  const group = chunk(files, size)
  const index = process.env.MATRIX || 1
  const specs = group[index - 1]

  console.log({ files, group, index })
  console.log(specs)
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
    })

    if (results.totalFailed > 0) {
      process.exit(1)
    }

    console.log(results.totalFailed)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})
