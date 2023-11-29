import { expect, test } from './fixtures'

test('Fill fields to check if they work', async ({ page, Commands }) => {
  await test.step('Login and goto create collection ', async () => {
    //E2E connection
    await Commands.e2elogin()
    //Goto
    await page.goto('/create/collection')
  })
  await test.step('Upload image ', async () => {
    //upload image logo
    await page.setInputFiles(
      'input[type="file"]',
      'tests/e2e/unsplash-image.jpg',
    )
  })
  await test.step('Fill collection name and description', async () => {
    //checks if Collection Name Title Exists
    await expect(
      page
        .getByTestId('collection-name')
        .filter({ has: page.getByText('Collection Name') }),
    ).toHaveCount(1)
    await page
      .getByTestId('collection-name')
      .locator('input')
      .fill('Best Collection Name')
    // Fill collection Description
    await page
      .getByTestId('collection-desc')
      .fill('Best Collection Ever Created')
  })
  await test.step('Activate unlimited items switch and verify if input is shown', async () => {
    //active unlimited items switch
    const collectionAmount = page.getByTestId('collection-maxAmount')
    await collectionAmount.locator('.o-switch').click()
    await expect(
      collectionAmount.getByTestId('collection-input-maximum-nfts'),
    ).toBeVisible()
  })
  await test.step('Check if create collection button is on page', async () => {
    //Check if button exists
    await expect(page.getByTestId('collection-create')).toBeVisible()
    await expect(
      page
        .getByTestId('collection-create')
        .filter({ has: page.getByText('Not Enough Funds') }),
    ).toHaveCount(1)
  })
})

test('Check if chain change works using the dropdown', async ({
  page,
  Commands,
}) => {
  await test.step('Login and goto create collection', async () => {
    await Commands.e2elogin()
    await page.goto('/create/collection')
  })

  //Chain dropdown
  await test.step('Wait for chain dropdown to be visible and select Kusamahub', async () => {
    expect(page.getByTestId('collection-chain')).toBeVisible()
    await page.getByTestId('collection-chain').selectOption('KusamaHub')
  })

  //Deposits and Balance
  await test.step('Verify if balances are loaded', async () => {
    await expect(page.getByTestId('collection-deposit')).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByTestId('collection-balance')).toBeVisible({
      timeout: 30000,
    })
  })

  //Dropdown change to RMRK2
  await test.step('Changes to RMRK2 and verifies if chain changed', async () => {
    await page.getByTestId('collection-chain').selectOption('RMRK2')
    await expect(page.getByTestId('chain')).toContainText('rmrk2')
  })
})

test('Verifies error message if collection name is empty', async ({ page }) => {
  await page.goto('/create/collection')
  const collectionName = page.getByTestId('collection-name')
  await collectionName.locator('input').fill('Kodadot Warning Test')
  await collectionName.locator('input').fill('')
  await page.getByTestId('collection-desc').click()
  await expect(collectionName.locator('.o-field__message-danger')).toBeVisible()
})
