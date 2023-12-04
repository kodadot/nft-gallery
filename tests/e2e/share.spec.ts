import { expect, test } from './fixtures'

const ITEM_ADDRESS_PATH = '/ahk/gallery/6-10'
const COLLECTION_ADDRESS_PATH = '/ahp/collection/38/'

test('Share Button on Gallery Item', async ({ page, Commands }) => {
  await page.goto(ITEM_ADDRESS_PATH)
  const shareBtn = page.getByTestId('gallery-item-share-button')

  //Copy Link
  await test.step('Clicks on copy link and verifies clipboard', async () => {
    await shareBtn.click()
    await shareBtn.getByText('Copy Link').click()
    const clipboardText1 = await page.evaluate('navigator.clipboard.readText()')
    expect(clipboardText1).toContain('/ahk/gallery/6-10')
  })

  //Twitter
  await test.step('Clicks on twitter and verify URL', async () => {
    await shareBtn.click()
    await Commands.checkNewTab(
      'https://twitter.com',
      await shareBtn.getByTestId('gallery-item-share-dropdown-twitter').click(),
    )
  })

  //QR Code
  await test.step('Clicks on QR code and verify its existance', async () => {
    await shareBtn.click()
    await shareBtn.getByText('QR Code').click()
    await expect(
      page.getByTestId('gallery-item-share-dropdown-qrcode'),
    ).toBeVisible()
    await page.keyboard.press('Escape')
  })
})

test('Share Button on Collection', async ({ page, Commands }) => {
  await page.goto(COLLECTION_ADDRESS_PATH)
  const shareBtn = page.getByTestId('share-button').first()
  await test.step('Share button functionality', async () => {
    //Copy
    await shareBtn.click()
    await page.getByTestId('hero-copy-link-dropdown').first().click()
    await Commands.copyText('http://localhost:9090/ahp/collection/38')
  })
  //QR
  await test.step('Clicks on QR code and verify its existance', async () => {
    await shareBtn.click()
    await page.getByTestId('hero-share-QR-dropdown').first().click()
    await expect(page.getByTestId('hero-share-qrcode-modal')).toBeVisible()
    await page.keyboard.press('Escape')
  })
  //Twitter
  await test.step('Clicks on twitter and verify URL', async () => {
    await shareBtn.click()
    await Commands.checkNewTab(
      'https://twitter.com',
      await page.getByTestId('hero-share-twitter-dropdown').first().click(),
    )
  })
})
