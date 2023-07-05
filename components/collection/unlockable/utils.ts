import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { pinJson } from '@/services/nftStorage'

export const UNLOCKABLE_CAMPAIGN = 'sha'
export const UNLOCKABLE_NAME = 'Shanghai Waifu'
export const unlockableDesc = (value: number) => `
  This anime waifu is a demonstration of unlockables at [KodaDot](https://kodadot.xyz)

  Owner of this item has **access to $${value} voucher**, which can be claimed in **[KodaShop](https://shop.kodadot.xyz)**.
  KodaMerch is then shipped right to your door step.

  It's **limited supply** and **only first 100 can claim** this voucher.

  Enjoy and be quick 😉
`

export async function createUnlockableMetadata(imageHash: string, value = 40) {
  const name = UNLOCKABLE_NAME
  const description = unlockableDesc(value)

  const meta = createMetadata(
    name,
    description,
    imageHash,
    undefined,
    [],
    'kodadot.xyz',
    'image/png'
  )

  const metaHash = await pinJson(meta, 'claimable')

  preheatFileFromIPFS(metaHash)
  return unSanitizeIpfsUrl(metaHash)
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}
