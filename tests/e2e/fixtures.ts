import { test as base } from '@playwright/test'
import { Commands } from './custom'

// Declare the types of your fixtures.
type MyFixtures = {
  Commands: Commands
}

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  Commands: async ({ page }, use) => {
    await use(new Commands(page))
  },
})
export { expect } from '@playwright/test'
