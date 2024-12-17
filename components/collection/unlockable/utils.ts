import { createOpenSeaMetadata as createMetadata } from '@kodadot1/hyperdata'

export const UNLOCKABLE_CAMPAIGN = 'bbw2023'
export const UNLOCKABLE_NAME = 'Berlin (Blockchain) Waifus'

export const unlockableDesc = (value: number) => `
  This anime waifu is a demonstration of unlockables at [KodaDot](https://kodadot.xyz)

  Owner of this item has **access to $${value} voucher**, which can be claimed in **[KodaShop](https://shop.kodadot.xyz)**.
  KodaMerch is then shipped right to your door step.

  It's **limited supply** and **only first 100 can claim** this voucher.

  Enjoy and be quick 😉
`

export const makeUnlockableMetadata = (
  name: string,
  description: string,
  imageHash: string,
  animationUrl: string | undefined,
  mimeType: string,
) =>
  createMetadata(
    name,
    description,
    imageHash,
    animationUrl,
    [],
    'kodadot.xyz',
    mimeType,
  )

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export const getRandomIntFromRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
