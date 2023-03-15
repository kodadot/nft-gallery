import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { processSingleMetadata } from '@/utils/cachingStrategy'

export type RMRK2Resources = {
  resources?: {
    src?: string
    thumb?: string
  }[]
}

export type NFTWithMetadata = NFT &
  NFTMetadata & { meta: NFTMetadata } & RMRK2Resources

function getGeneralMetadata(nft: NFTWithMetadata) {
  return {
    ...nft,
    name: nft.name || nft.id,
    image: sanitizeIpfsUrl(nft.meta.image),
    animation_url: sanitizeIpfsUrl(nft.meta.animation_url || ''),
    type: nft.meta.type || '',
  }
}

function getRmrk2Resources(nft: NFTWithMetadata) {
  const thumb = nft.resources && nft.resources[0].thumb
  const src = nft.resources && nft.resources[0].src

  return {
    ...nft,
    image: sanitizeIpfsUrl(thumb || src || ''),
  }
}

async function getProcessMetadata(nft: NFTWithMetadata) {
  const metadata = (await processSingleMetadata(
    nft.metadata
  )) as NFTWithMetadata
  const image = sanitizeIpfsUrl(metadata.image || '')
  const animation_url = sanitizeIpfsUrl(metadata.animation_url || '')

  return {
    ...nft,
    name: nft.name || metadata.name || nft.id,
    image,
    animation_url,
    type: metadata.type || '',
  }
}

async function getNftMetadata(nft: NFTWithMetadata, prefix: string) {
  // if subsquid already give us the metadata, we don't need to fetch it again
  if (nft.meta && nft.meta.image) {
    return getGeneralMetadata(nft)
  }

  // if it's rmrk2, we need to check `resources` field
  if (prefix === 'rmrk2' && nft.resources?.length) {
    return getRmrk2Resources(nft)
  }

  return await getProcessMetadata(nft)
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
