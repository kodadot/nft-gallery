import { expect, test } from './fixtures'
import path from 'path'

//const KSM_TEST_ADDRESS_PROFILE = '/ahk/u/CmWHiv7h4m9tEzKD94DH4mqwGTvsdYQe2nouWPF7ipmHpqA'

//specifies what pages are going to be tested for visual regression
const VR_PATHS = [
  '/ahp/create',
  '/ahp/drops',
  '/ahp/explore/items?listed=true',
  '/ahp/explore/collectibles',
  '/ahp/create/nft',
]

//solve timeouts

//commands
//npx playwright test -g "Screenshoting canary pages" --update-snapshots --workers 1
//npx playwright test -g "Comparing it to local" --workers 1

//primeiro teste só atualiza a canary se ela tiver realmente mudado

//landing
//drops
//explore->items
//explore->collections
//create->nft
//create->collection
//transfer
//teleport
//migrate
//create landing
//massmint
//4 tabs in collection

//data-testid="type-image"

test('Screenshoting canary pages', async ({ page, Commands }) => {
  test.setTimeout(120000)
  for (const data of VR_PATHS) {
    await page.goto(`https://canary.kodadot.xyz${data}`, {
      waitUntil: 'networkidle',
    })
    await Commands.waitForNoSkeletons()
    await expect(page).toHaveScreenshot(`vr${data}.png`, {
      fullPage: true,
      animations: 'disabled',
      stylePath: path.join(__dirname, 'vr.scss'),
    })
  }
  await page.close()
})

test('Comparing it to local', async ({ page, baseURL, Commands }) => {
  test.setTimeout(120000)
  for (const data of VR_PATHS) {
    await page.goto(`${baseURL}${data}`, { waitUntil: 'networkidle' })
    console.log(`${baseURL}${data}`)
    await Commands.waitForNoSkeletons()
    await expect
      .soft(page)
      .toHaveScreenshot(`vr${data}.png`, {
        fullPage: true,
        animations: 'disabled',
        stylePath: path.join(__dirname, 'vr.scss'),
      })
  }
  await page.close()
})
