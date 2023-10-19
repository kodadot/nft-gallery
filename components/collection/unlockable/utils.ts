import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { pinJson } from '@/services/nftStorage'
import type { ApiPromise } from '@polkadot/api'

export const UNLOCKABLE_CAMPAIGN = 'bbw2023'
export const UNLOCKABLE_NAME = 'Berlin (Blockchain) Waifus'

export const unlockableDesc = (value: number) => `
  This anime waifu is a demonstration of unlockables at [KodaDot](https://kodadot.xyz)

  Owner of this item has **access to $${value} voucher**, which can be claimed in **[KodaShop](https://shop.kodadot.xyz)**.
  KodaMerch is then shipped right to your door step.

  It's **limited supply** and **only first 100 can claim** this voucher.

  Enjoy and be quick 😉
`

export async function createUnlockableMetadata(
  imageHash: string,
  description: string,
  name: string = UNLOCKABLE_NAME,
  miniType: string = 'image/png',
) {
  const meta = createMetadata(
    name,
    description,
    imageHash,
    undefined,
    [],
    'kodadot.xyz',
    miniType,
  )

  const metaHash = await pinJson(meta, 'claimable')

  preheatFileFromIPFS(metaHash)
  return unSanitizeIpfsUrl(metaHash)
}

export const generativeTokenMintArgs = async (
  collectionId: string,
  nextId: string,
  metaHash: string,
  api: ApiPromise,
) => {
  const { accountId } = useAuth()

  const create = api.tx.nfts.mint(collectionId, nextId, accountId.value, null)

  return [create, api.tx.nfts.setMetadata(collectionId, nextId, metaHash)]
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}
