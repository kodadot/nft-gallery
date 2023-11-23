import { expect, test } from './fixtures'

test('Fill fields to check if they work', async ({ page, Commands }) => {
  //E2E connection
  await Commands.e2elogin()
  //Goto
  await page.goto('/create/collection')
  //upload image logo
  await page.setInputFiles('input[type="file"]', 'tests/e2e/unsplash-image.jpg')
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
  await page.getByTestId('collection-desc').fill('Best Collection Ever Created')
  //active unlimited items switch
  const collectionAmount = page.getByTestId('collection-maxAmount')
  await collectionAmount.locator('.o-switch').click()
  await expect(
    collectionAmount.getByPlaceholder('1 is the minimum'),
  ).toBeVisible()
  //Check if button exists
  await expect(page.getByTestId('collection-create')).toBeVisible()
  await expect(
    page
      .getByTestId('collection-create')
      .filter({ has: page.getByText('Not Enough Funds') }),
  ).toHaveCount(1)
})

test('Check if chain change works using the dropdown', async ({
  page,
  Commands,
}) => {
  //E2E connection
  await Commands.e2elogin()
  await page.goto('/create/collection')
  expect(page.getByTestId('collection-chain')).toBeVisible()
  await page.getByTestId('collection-chain').selectOption('KusamaHub')
  //Check if balances and deposits shows
  await expect(page.getByTestId('collection-deposit')).toBeVisible({
    timeout: 30000,
  })
  await expect(page.getByTestId('collection-balance')).toBeVisible({
    timeout: 30000,
  })
  await page.getByTestId('collection-chain').selectOption('RMRK2')
})

test('Show warning message on field when collection name empty', async ({
  page,
}) => {
  await page.goto('/create/collection')
  // defines a variable containing the collection name data-testid
  const collectionName = page.getByTestId('collection-name')
  // Fill and check if Collection Name works properly by checking warning
  await collectionName.locator('input').fill('Kodadot Warning Test')
  await collectionName.locator('input').fill('')
  await page.getByTestId('collection-desc').click()
  await expect(collectionName.locator('.o-field__message-danger')).toBeVisible()
})
