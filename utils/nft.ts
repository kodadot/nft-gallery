import { NFTWithMetadata } from '@/composables/useNft'
import { EntityWithMeta } from './ipfs'

export const parseNftAvatar = async (
  entity: EntityWithMeta,
): Promise<string> => {
  const { urlPrefix } = usePrefix()
  const meta = await getNftMetadata(
    entity as unknown as NFTWithMetadata,
    urlPrefix.value,
  )
  return meta.image
}

const suffixRegex = new RegExp('#\\d+$', 'g')
export const addSnSuffixName = (name: string = '', sn?: string) => {
  if (!name || !sn) {
    return name
  }
  return suffixRegex.test(name) ? name : `${name} #${sn}`
}
