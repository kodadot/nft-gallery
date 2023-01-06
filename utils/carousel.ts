import { formatDistanceToNow } from 'date-fns'
import { get, set } from 'idb-keyval'
import { isEmpty } from '@kodadot1/minimark'
import { processSingleMetadata } from '@/utils/cachingStrategy'
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

    return {
      ...nft,
      timestamp: formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
      }),
      unixTime: new Date(timestamp).getTime(),
      price: nft.price || 0,
      image: metaImage && sanitizeIpfsUrl(metaImage),
      animationUrl: metaAnimationUrl && sanitizeIpfsUrl(metaAnimationUrl),
      chain: chain || urlPrefix.value,
    }
  })
}

export const setNftMetaFromCache = async (nfts): Promise<CarouselNFT[]> => {
  return await Promise.all(
    nfts.map(async (nft) => {
      if (nft.image) {
        return nft
      }

      let meta = await get(nft.metadata)

      if (isEmpty(meta)) {
        meta = await fetchNFTMetadata(
          nft,
          getSanitizer(nft.metadata, 'pinata', 'permafrost')
        )
        set(nft.metadata, meta)
      }
      const imageSanitizer = getSanitizer(meta.image, 'image')
      return {
        ...nft,
        name: meta.name,
        image: imageSanitizer(meta.image),
        animation_url: sanitizeIpfsUrl(
          meta.animation_url || meta.image,
          'pinata'
        ),
      }
    })
  )
}

interface Events {
  nft: {
    metadata: string
    meta: {
      id: string
      image: string
    }
  }
}

/**
 * Catch undefined meta
 */
export const fallbackMetaByNftEvent = async (events: Events[]) => {
  for (const event of events) {
    if (!event.nft.meta) {
      event.nft.meta = {
        id: event.nft.metadata,
        image: '',
      }
      await processSingleMetadata(event.nft.metadata)
    }
  }
}

export const convertLastEventFlatNft = (e: LastEvent) => {
  return {
    id: e.nftId,
    metadata: e.metadata,
    issuer: e.issuer,
    currentOwner: e.currentOwner,
    timestamp: e.timestamp,
    name: e.name,
    price: e.meta,
    meta: {
      id: e.metadata,
      image: e.image,
      animationUrl: e.animationUrl ? sanitizeIpfsUrl(e.animationUrl) : null,
    },
    collectionId: e.collectionId,
    collectionName: e.collectionName,
  }
}

export const convertLastEventToNft = (e: LastEvent) => {
  return {
    meta: e.meta,
    timestamp: e.timestamp,
    nft: {
      id: e.nftId,
      name: e.name,
      issuer: e.issuer,
      currentOwner: e.currentOwner,
      metadata: e.metadata,
      animationUrl: sanitizeIpfsUrl(e.animationUrl),
      meta: {
        id: e.metadata,
        image: e.image,
      },
    },
  }
}
