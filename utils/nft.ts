import type { EntityWithMeta } from './ipfs'
import type { NFTWithMetadata } from '@/composables/useNft'

export const parseNftAvatar = async (
  entity: EntityWithMeta,
): Promise<string> => {
  const meta = await getNftMetadata(entity as unknown as NFTWithMetadata)
  return meta.image
}
