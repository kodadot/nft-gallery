import { formatDistanceToNow } from 'date-fns'
import { LastEvent } from '@/utils/types/types'

import { CarouselNFT } from '@/components/base/types'
import { fetchNFTMetadata, getSanitizer, sanitizeIpfsUrl } from '@/utils/ipfs'
/**
 * Format the data to fit with CarouselNFT[]
 * Get cloudflare images
 * Update timestamp
 */
export const formatNFT = (nfts, chain?: string): CarouselNFT[] => {
  if (!nfts) {
    return []
  }
  const { urlPrefix } = usePrefix()
  const data = nfts.filter((nft) => Boolean(nft.meta))

  return data.map((nft) => {
    const timestamp = nft.updatedAt || nft.timestamp
    const metaImage = nft.meta.image
    const metaAnimationUrl = nft.meta.animationUrl
    const name = nft.name || nft.meta.name

    return {
      ...nft,
      timestamp: timestamp
        ? formatDistanceToNow(new Date(timestamp), {
            addSuffix: true,
          })
        : '',
      unixTime: new Date(timestamp).getTime(),
      price: nft.price || 0,
      image: metaImage && sanitizeIpfsUrl(metaImage),
      animationUrl: metaAnimationUrl && sanitizeIpfsUrl(metaAnimationUrl),
      collectionName: nft.collectionName || nft.collection?.name || '--',
      name,
      collectionId: nft.collectionId || nft.collection?.id,
      chain: chain || urlPrefix.value,
    }
  })
}

export const setCarouselMetadata = async (nfts): Promise<CarouselNFT[]> => {
  return await Promise.all(
    nfts.map(async (nft) => {
      if (nft.image) {
        return nft
      }

      const meta = await fetchNFTMetadata(nft, getSanitizer(nft.metadata))
      const image = meta.image || ''
      const imageSanitizer = getSanitizer(image, 'image')
      return {
        ...nft,
        name: meta.name,
        image: imageSanitizer(image),
        animation_url: sanitizeIpfsUrl(meta.animation_url || image),
      }
    })
  )
}

export const convertLastEventFlatNft = (e: LastEvent) => {
  return {
    ...e,
    meta: {
      id: e.metadata,
      image: e.image,
      animationUrl: e.animationUrl,
    },
  }
}
