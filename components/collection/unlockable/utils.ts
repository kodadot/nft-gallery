import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { pinJson } from '@/services/nftStorage'

export async function createUnlockableMetadata(imageHash: string) {
  const name = 'Corn Waifu'
  const description = `This anime waifu loves corn with butter and salt.
    Please dont microwave your corn, cook it like a normal person. Boil salty water and add corn - cook 15 minutes.
    Your anime waifu will make you a popcorn if you defeat her in a final battle.
    Only true winner can enjoy good dinner in a form of corn`

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
