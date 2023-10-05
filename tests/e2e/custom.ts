import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class Commands {
  constructor(public readonly page: Page) {}

  async e2elogin() {
    await this.page.goto('/e2e-login')
    //await Promise.all([
    //    //this.page.waitForRequest('http://localhost:9090/_nuxt/pages/e2e-login.js')
    //    this.page.waitForResponse(resp => resp.status() === 200)
    //  ])
    await this.page.waitForTimeout(10000)
    await expect(this.page.getByTestId('mockAddress')).toHaveText('true')
  }

  async copyText(paste: string) {
    const clipboardText1 = await this.page.evaluate(
      'navigator.clipboard.readText()',
    )
    expect(clipboardText1).toContain(paste)
  }
}
