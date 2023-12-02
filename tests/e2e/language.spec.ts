import { expect, test } from './fixtures'

test('Check Language translations', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('')
  await page.waitForLoadState('networkidle')
  //DE
  await page.getByTestId('navbar-profile-dropdown').click()
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
