import { expect, test } from '@playwright/test'

const chains = ['Kusama', 'RMRK2', 'KusamaHub [Beta]', 'PolkadotHub [Beta]']

test('Collection Creation', async ({ page }) => {
  let i = 0
  //E2E connection
  await page.goto('/e2e-login')
  await page.waitForTimeout(10000)
  await expect(page.getByTestId('mockAddress')).toHaveText('true')
  await page.goto('/create/collection')
  //loop trough possible chains
  for (const data of chains) {
    await page.getByTestId('collection-chain').selectOption(`${chains[i]}`)
    i++
    //upload image logo
    await page.setInputFiles(
      'input[type="file"]',
      'tests/e2e/unsplash-image.jpg'
    )
    //checks if Collection Name Title Exists
    await expect(
      page
        .getByTestId('collection-name')
        .filter({ has: page.getByText('Collection Name') })
    ).toHaveCount(1)
    // defines a variable containing the collection name data-testid
    const collectionName = page.getByTestId('collection-name')
    // Fill and check if Collection Name works properly by cheking warning
    await collectionName.locator('input').fill('Kodadot Automatic Collection')
    await collectionName.locator('input').fill('')
    await page.getByTestId('collection-desc').click()
    await expect(collectionName.locator('.o-icon')).toBeVisible()
    await expect(collectionName.locator('.o-field__message')).toBeVisible()
    // Fill collection Description
    await page
      .getByTestId('collection-desc')
      .fill('Best Collection Ever Created')
    //active unlimited items switch
    const collectionAmount = page.getByTestId('collection-maxAmount')
    await collectionAmount.locator('.o-switch').click()
    await expect(collectionName.locator('.o-input')).toBeVisible()
    await collectionAmount.locator('.o-switch').click()
    //Check if balances and deposits shows
    await expect(page.getByTestId('collection-deposit')).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByTestId('collection-balance')).toBeVisible({
      timeout: 30000,
    })
    //Check if button exists
    await expect(page.getByTestId('collection-create')).toBeVisible()
    await expect(
      page
        .getByTestId('collection-create')
        .filter({ has: page.getByText('Not Enough Funds') })
    ).toHaveCount(1)
  }
})
