import { expect, test } from './fixtures'

test('Translations', async ({ page, Commands }) => {
  await test.step('Login and go to', async () => {
    await Commands.e2elogin()
    await page.goto('')
  })

  //DE
  await test.step('Check German Translation', async () => {
    await page.getByTestId('navbar-profile-dropdown').click()
    await page.getByTestId('sidebar-language').click()
    await expect(page.getByRole('menu')).toBeVisible()
    await page.getByTestId('sidebar-language-de').click()
    await expect(
      page.getByTestId('create').filter({ has: page.getByText('Erstellen') }),
    ).toHaveCount(1)
    await expect(
      page
        .getByTestId('latest-sales')
        .filter({ has: page.getByText('Letzte Verkäufe') }),
    ).toHaveCount(1)
  })

  //FR
  await test.step('Check French translation', async () => {
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
  })

  //ES
  await test.step('Check Spanish translation', async () => {
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
})
