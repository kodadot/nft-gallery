import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { processSingleMetadata } from './cachingStrategy'
import { EntityWithMeta, sanitizeIpfsUrl } from './ipfs'

export const parseNftAvatar = async (
  entity: EntityWithMeta
): Promise<string> => {
  if (entity.meta?.image) {
    return sanitizeIpfsUrl(entity.meta.image)
  } else {
    const meta = (await processSingleMetadata(entity.metadata)) as NFTMetadata
    return sanitizeIpfsUrl(meta?.image || meta?.mediaUri)
  }
}
