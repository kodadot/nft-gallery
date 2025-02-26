import type { EntityWithMeta } from './ipfs'
import type { NFTWithMetadata } from '@/composables/useNft'

export type AbstractCreatedNFT = {
  collection: string
  transferable: number
  sn: string
  metadata: string
}

export type CreatedNFT = AbstractCreatedNFT & {
  name?: string
  symbol: string
  currentOwner?: string
}

export const parseNftAvatar = async (
  entity: EntityWithMeta,
): Promise<string> => {
  const meta = await getNftMetadata(entity as unknown as NFTWithMetadata)
  return meta.image
}

export const toNFTId = (nft: CreatedNFT, blockNumber: string | number): string => {
  const { collection, symbol: instance, sn } = nft
  if (!collection || !instance || !sn) {
    throw new ReferenceError('[APP] toNFTId: invalid nft')
  }

  return `${blockNumber}-${collection}-${instance}-${sn}`
}
