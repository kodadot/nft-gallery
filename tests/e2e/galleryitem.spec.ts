import { expect, test } from '@playwright/test'

test('Organic user test of gallery item page', async ({ page }) => {
  await page.goto('/ahk/gallery/6-10')
  //activity tab
  await page
    .getByTestId('gallery-item-tabs')
    .locator('[aria-controls="1-content"]')
    .click()
  await page.getByTestId('gallery-item-activity-filter-all').click()
  await expect(
    page.getByTestId('gallery-item-activity-table').locator('td').first()
  ).toBeVisible()
  //details tab
  await page
    .getByTestId('gallery-item-description-neotabs')
    .locator('[aria-controls="2-content"]')
    .click()
  await expect(
    page.getByTestId('gallery-item-details-tab-content')
  ).toBeVisible()
  //share button
  await page.getByTestId('gallery-item-share-button').click()
  await expect(
    page.getByTestId('gallery-item-share-dropdown-qrcode')
  ).toBeVisible()
  //chart tab
  await page
    .getByTestId('gallery-item-tabs')
    .locator('[aria-controls="2-content"]')
    .click()
  await expect(page.getByTestId('gallery-item-chart')).toBeVisible()
  //description tab
  await page
    .getByTestId('gallery-item-description-neotabs')
    .locator('[aria-controls="0-content"]')
    .click()
  await expect(
    page.getByTestId('gallery-item-description-tab-content')
  ).toBeVisible()
  //more button
  await page.getByTestId('gallery-item-more-button').click()
  await expect(
    page.getByTestId('gallery-item-more-dropdown-download')
  ).toBeVisible()
  //checks if page redirects properly to collection
  await page.getByTestId('item-collection').click()
  expect(page.url()).toContain('/ahk/collection/6')
})
