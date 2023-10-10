import { expect, test } from '@playwright/test'

test('Check Language translations', async ({ page }) => {
  await page.goto('/e2e-login')
  await page.waitForTimeout(10000)
  await expect(page.getByTestId('mockAddress')).toHaveText('true')
  await page.goto('')
  //DE
  await page.getByTestId('profileDropdown').click()
  await page.getByTestId('sidebar-language').click()
  await expect(page.getByRole('menu')).toBeVisible()
  //await expect(page.getByTestId('skeleton-multiple-balances')).toHaveCount(0)
  await page.getByTestId('sidebar-language-de').click()
  await expect(
    page.getByTestId('create').filter({ has: page.getByText('Erstellen') }),
  ).toHaveCount(1)
  await expect(
    page
      .getByTestId('latest-sales')
      .filter({ has: page.getByText('Letzte Verkäufe') }),
  ).toHaveCount(1)
  //FR
  await page.getByTestId('sidebar-language').click()
  await page.getByTestId('sidebar-language-fr').click()
  await expect(
    page.getByTestId('create').filter({ has: page.getByText('Créer') }),
  ).toHaveCount(1)
  await expect(
    page
      .getByTestId('latest-sales')
      .filter({ has: page.getByText('Dernières ventes') }),
  ).toHaveCount(1)
  //ES
  await page.getByTestId('sidebar-language').click()
  await page.getByTestId('sidebar-language-es').click()
  await expect(
    page.getByTestId('create').filter({ has: page.getByText('Crear') }),
  ).toHaveCount(1)
  await expect(
    page
      .getByTestId('latest-sales')
      .filter({ has: page.getByText('Ventas más recientes') }),
  ).toHaveCount(1)
})
