import { expect, test } from '@playwright/test'

let i = 0

const footerLinks = [
  {
    linkName: 'Ambassador Program',
    linkAddress:
      'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/ambassador-program',
  },
  {
    linkName: 'Artist Ambassador',
    linkAddress:
      'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/artist-ambassador-program',
  },
  {
    linkName: 'Referral Program',
    linkAddress:
      'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/artist-referral-program',
  },
  {
    linkName: 'Developers',
    linkAddress: 'https://developers.kodadot.xyz/',
  },
  {
    linkName: 'FAQ',
    linkAddress: 'https://hello.kodadot.xyz/ecosystem/faq',
  },
  {
    linkName: 'Tutorial',
    linkAddress: 'https://hello.kodadot.xyz/tutorial/wallet',
  },
  {
    linkName: 'About',
    linkAddress: 'https://hello.kodadot.xyz/about-us/who-are-we',
  },
  {
    linkName: 'Careers',
    linkAddress:
      'https://hello.kodadot.xyz/be-part-of-kodadot/join-as-a-developer/hiring',
  },
  {
    linkName: 'Press Kit',
    linkAddress: 'https://github.com/kodadot/kodadot-presskit/tree/main/pre-v4',
  },
  //{
  //    linkName: 'MerchShop',
  //    linkAddress: 'https://shop.kodadot.xyz/',
  //}
  //{
  //    linkName: 'Blog',
  //    linkAddress: 'https://localhost:9090/blog',
  //},
]

test('Check Footer links and Subscription', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByTestId('entire-footer')
  //checks subscribe functionality
  const footerSubscribe = page.getByTestId('footer-subscribe')
  await page.getByPlaceholder('jane.doe@kodadot.xyz').fill('a')
  await footerSubscribe.locator('button').click()
  await expect(footerSubscribe.locator('.error')).toBeVisible()
  //check footer links
  for (const data of footerLinks) {
    const newTabPromise = page.waitForEvent('popup')
    await footer.getByRole('link', { name: footerLinks[i].linkName }).click()
    const newTab = await newTabPromise
    await newTab.waitForLoadState()
    await expect(newTab).toHaveURL(footerLinks[i].linkAddress)
    await newTab.close()
    i++
  }
})
