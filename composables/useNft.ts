import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import type { BaseNFTMeta } from '@/components/base/types'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { getMimeType, isAudio as isAudioMimeType } from '@/utils/gallery/media'
import unionBy from 'lodash/unionBy'
import type { Ref } from 'vue'

export type NftResources = {
  id: string
  src?: string
  thumb?: string
  mimeType?: string
  animation?: string
  meta?: {
    id: string
    image?: string
    animationUrl?: string
  }
}

export type ItemResources = {
  mediaUri?: string
  resources?: NftResources[]
}

export type NFTWithMetadata = NFT &
  NFTMetadata & { meta: BaseNFTMeta } & ItemResources

function getAttributes(nft, metadata) {
  const hasMetadataAttributes =
    metadata.attributes && metadata.attributes.length > 0
  const attr = unionBy(
    nft?.attributes?.concat(...(nft?.meta?.attributes || [])),
    (item) => item.trait_type || item.key,
  )
  const hasEmptyNftAttributes = attr.length === 0

  return hasMetadataAttributes && hasEmptyNftAttributes
    ? metadata.attributes
    : attr
}

function getGeneralMetadata(nft: NFTWithMetadata) {
  return {
    ...nft,
    name: nft.name || nft.meta.name || nft.id,
    description: nft.description || nft.meta.description || '',
    image: sanitizeIpfsUrl(nft.meta.image),
    animationUrl: sanitizeIpfsUrl(
      nft.meta.animation_url || nft.meta.animationUrl || '',
    ),
    type: nft.meta.type || '',
    attributes: getAttributes(nft, nft.meta),
  }
}

export async function useNftCardIcon(nft: Ref<NFTWithMetadata>) {
  const { isAudio } = await useNftMimeType(nft)
  const { unlockableIcon } = useUnlockableIcon()

  const showCardIcon = computed(() => isAudio)

  const cardIcon = computed(() => {
    if (isAudio) {
      return '/sound.svg'
    }
    return unlockableIcon.value
  })

  return { showCardIcon, cardIcon }
}

export async function useNftMimeType(nft?: Ref<NFTWithMetadata>) {
  if (!nft?.value.meta?.animationUrl) {
    return {
      isAudio: false,
    }
  }

  const mimeType = await getMimeType(
    sanitizeIpfsUrl(nft.value.meta.animationUrl),
  )

  return {
    isAudio: isAudioMimeType(mimeType),
  }
}

async function getRmrk2Resources(nft: NFTWithMetadata) {
  const thumb = nft.resources?.[0]?.thumb
  const src = nft.resources?.[0]?.src
  const image = sanitizeIpfsUrl(thumb || src || '')
  const type = await getMimeType(image)

  return {
    ...getGeneralMetadata(nft),
    image,
    type,
  }
}

async function getProcessMetadata(nft: NFTWithMetadata) {
  const metadata = await processSingleMetadata<NFTWithMetadata>(nft.metadata)
  const image = sanitizeIpfsUrl(metadata.image || metadata.mediaUri || '')
  const animationUrl = sanitizeIpfsUrl(metadata.animation_url || '')

  return {
    ...nft,
    name: nft.name || metadata.name || nft.id,
    description: nft.description || metadata.description || '',
    image,
    animationUrl,
    type: metadata.type || '',
    attributes: getAttributes(nft, metadata),
  }
}

export function getNftMetadata(nft: NFTWithMetadata, prefix: string) {
  // if subsquid already give us the metadata, we don't need to fetch it again
  if (nft.meta?.image) {
    return getGeneralMetadata(nft)
  }

  // if it's rmrk2, we need to check `resources` field
  if (prefix === 'ksm' && nft.resources?.length) {
    return getRmrk2Resources(nft)
  }

  return getProcessMetadata(nft)
}

export default function useNftMetadata(nft: NFTWithMetadata) {
  const item = ref<NFTWithMetadata>(nft)
  const { urlPrefix } = usePrefix()

  onMounted(async () => {
    item.value = await getNftMetadata(nft, urlPrefix.value)
  })

  return {
    nft: computed(() => item.value),
  }
}
