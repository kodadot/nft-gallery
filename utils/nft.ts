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

const trimLeadingZeros = (of: number | string) => {
  const trimmedString = of.toString().replace(/^0+(?=\d)/, '')

  return typeof of === 'number' ? Number(trimmedString) : trimmedString
}

const suffixRegex = /#\d+$/
export const nameWithIndex = (name: string = '', sn?: string) => {
  if (!name || !sn) {
    return name
  }
  return suffixRegex.test(name) ? name : `${name} #${trimLeadingZeros(sn)}`
}
