import { expect, test } from './fixtures'

const TEST_DROPS = [
  {
    address: '/ahp/drops/convergente',
    collection: '/ahp/collection/112',
  },
  {
    address: '/ahp/drops/chroma',
    collection: '/ahp/collection/51',
  },
  {
    address: '/ahp/drops/echo',
    collection: '/ahp/collection/95',
  },
]

const addresses = TEST_DROPS.map((drop) => drop.address)
const collections = TEST_DROPS.map((drop) => drop.collection)

test('make sure drops page with type holder not broken', async ({ page }) => {
  await page.goto(addresses[2])
  await expect(page.locator('div.content-markdown')).toHaveText(
    `
    Artist: Nicolas Lebrun
    Echo is a captivating exploration of the realm of composition, where the essence lies in a dynamic interplay between samples and a meticulous process...
    `,
  )

  await page.goto(addresses[1])
  await expect(page.locator('div.content-markdown')).toHaveText(
    `
    Artist: @atimtay
    'Chroma Lattice' conjures an image of a vibrant and structured visual experience. In this generative art project, the name suggests an exploration of color...
    `,
  )
})

//CONVERGENTE
test('Drop page verification', async ({ page, Commands }) => {
  await page.goto(addresses[0])

  await test.step('Created By', async () => {
    await expect(page.getByTestId('drop-created-by-container')).toBeVisible()
  })

  await test.step('Collected By', async () => {
    await expect(page.getByTestId('drop-collected-by-container')).toBeVisible()
    await expect(page.getByTestId('collector-avatar').first()).toBeVisible()
    await page.getByTestId('collector-avatar').first().hover()
    await expect(page.getByTestId('identity-popover-container')).toBeVisible()
  })

  await test.step('Text Description', async () => {
    const textDesc = page.getByTestId('drops-text-description-container')
    const textDescButton = page.getByTestId('drops-text-description-button')
    await expect(textDescButton).toBeVisible()
    await expect(textDesc).toBeVisible()
    await textDescButton.click()
    const getTextDesc = await textDesc.locator('p').last().innerText()
    const descTextEnding = getTextDesc.slice(-10)
    await textDescButton.click()
    await expect(textDesc).not.toHaveText(descTextEnding)
  })

  await test.step('Mint Button State', async () => {
    const dropContainer = page.getByTestId('drop-phase-container')
    const dropPhase = page.getByTestId('drop-status')
    const mintButton = page.getByTestId('drop-mint-button')
    await expect(dropContainer).toBeVisible()
    await expect(dropPhase).toBeVisible()
    await expect(mintButton).toBeVisible()
    const dropPhaseStatus = await dropPhase.innerText()

    if (dropPhaseStatus == 'Minting Now') {
      await expect(mintButton).toHaveText('Connect your wallet')
      await page.getByTestId('drop-mint-button').click()
      await expect(
        page.getByTestId('wallet-connect-sidebar-modal'),
      ).toBeVisible()
      await Commands.e2elogin()
      await page.goto(addresses[0])
      await expect(mintButton).toContainText('Mint For')
      await expect(page.getByTestId('drop-stepper-container')).toBeVisible()
    } else {
      await expect(mintButton).toContainText('See Listings')
      await page.getByTestId('drop-mint-button').click()
      await page.waitForTimeout(2000)
      await expect(page).toHaveURL(`${collections[0]}?listed=true`)
    }
  })
})

test('View Collection', async ({ page }) => {
  await page.goto(addresses[0])
  await page.waitForTimeout(2000)
  await expect(page.getByTestId('drops-view-collection-button')).toBeVisible()
  await page.getByTestId('drops-view-collection-button').click()
  await page.waitForTimeout(2000)
  await expect(page).toHaveURL(collections[0])
})
