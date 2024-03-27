import { expect, test } from '@playwright/test'

test('make sure drops page with type holder not broken', async ({ page }) => {
  await page.goto('/ahp/drops/echo')
  await expect(page.locator('div.content-markdown')).toHaveText(
    `
    Artist: Nicolas Lebrun
    Echo is a captivating exploration of the realm of composition, where the essence lies in a dynamic interplay between samples and a meticulous process...
    `,
  )

  await page.goto('/ahp/drops/chroma')
  await expect(page.locator('div.content-markdown')).toHaveText(
    `
    Artist: @atimtay
    'Chroma Lattice' conjures an image of a vibrant and structured visual experience. In this generative art project, the name suggests an exploration of color...
    `,
  )
})
