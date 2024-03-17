import { test as base } from '@playwright/test'
import { Commands } from './custom'

type MyFixtures = {
  Commands: Commands
}

// Extend base
export const test = base.extend<MyFixtures>({
  Commands: async ({ page }, use) => {
    await use(new Commands(page))
  },
  page: async ({ context, page }, use) => {
    page.on('pageerror', (err) => {
      throw new Error('Failing test due to error in browser: ' + err)
    })
    context.on('weberror', (err) => {
      throw new Error('Failing test due to error in browser: ' + err.error())
    })
    await use(page)
  },
})
export { expect } from '@playwright/test'
