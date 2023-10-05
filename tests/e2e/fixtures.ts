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
})
export { expect } from '@playwright/test'
