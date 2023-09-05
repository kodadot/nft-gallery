import { NFTWithMetadata } from '@/composables/useNft'
import { EntityWithMeta } from './ipfs'

export const parseNftAvatar = async (
  entity: EntityWithMeta
): Promise<string> => {
  const { urlPrefix } = usePrefix()
  const meta = await getNftMetadata(
    entity as unknown as NFTWithMetadata,
    urlPrefix.value
  )
  return meta.image
}
