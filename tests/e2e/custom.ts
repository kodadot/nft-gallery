import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class Commands {
  constructor(public readonly page: Page) {}

  async e2elogin() {
    await this.page.goto('/e2e-login')
    await expect(
      this.page.getByTestId('navbar-button-connect-wallet'),
    ).toBeHidden()
    await expect(this.page.getByTestId('mockAddress')).toHaveText('true', {
      timeout: 15000,
    })
  }

  async copyText(paste: string) {
    const clipboardText1 = await this.page.evaluate(
      'navigator.clipboard.readText()',
    )
    expect(clipboardText1).toContain(paste)
  }

  async scrollDownSlow() {
    await this.page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < document.body.scrollHeight; i += 100) {
        window.scrollTo(0, i)
        await delay(200)
      }
    })
  }
  async scrollDownAndStop() {
    await this.page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < 800; i += 100) {
        window.scrollTo(0, i)
        await delay(200)
      }
    })
  }
  async acceptCookies() {
    await this.page.getByRole('button', { name: 'Accept' }).click()
  }
  async checkNewTab(url: string, clickAction) {
    const newTabPromise = this.page.waitForEvent('popup')
    await clickAction
    const newTab = await newTabPromise
    await expect(newTab).toHaveURL(new RegExp(url))
    await newTab.close()
  }
}
