import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { pinJson } from '@/services/nftStorage'

export const UNLOCKABLE_CAMPAIGN = 'prg'
export const UNLOCKABLE_NAME = 'Prague Waifu'
export const UNLOCKABLE_DESC = `
  Enjoy your time in Prague Blockchain Week in a good mood,
  and invite this incredibly beautiful waifu for a cup of coffee.
  Add her to your collection today
`

export async function createUnlockableMetadata(imageHash: string) {
  const name = UNLOCKABLE_NAME
  const description = UNLOCKABLE_DESC

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
  const hash = unSanitizeIpfsUrl(metaHash)

  return hash
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}
