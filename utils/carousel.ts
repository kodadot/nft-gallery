import { formatDistanceToNow } from 'date-fns'
import {
  getCloudflareImageLinks,
  getProperImageLink,
  processSingleMetadata,
} from '@/utils/cachingStrategy'
import { LastEvent } from '@/utils/types/types'

import { CarouselNFT } from '@/components/base/types'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
/**
 * Format the data to fit with CarouselNFT[]
 * Get cloudflare images
 * Update timestamp
 */
export const formatNFT = async (
  nfts,
  chain = 'rmrk'
): Promise<CarouselNFT[]> => {
  if (!nfts) {
    return []
  }

  const data = nfts.filter((nft) => Boolean(nft.meta))
  const images = await getCloudflareImageLinks(data.map((nft) => nft.meta.id))
  const imageOf = getProperImageLink(images)

  return data.map((nft) => {
    const timestamp = nft.updatedAt || nft.timestamp
    const metaId = nft.meta.id
    const metaImage = nft.meta.image
    const metaAnimationUrl = nft.meta.animationUrl

    return {
      ...nft,
      timestamp: formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
      }),
      unixTime: new Date(timestamp).getTime(),
      price: nft.price || 0,
      image: imageOf(metaId, metaImage),
      animationUrl: imageOf(metaId, metaAnimationUrl) || '',
      chain,
    }
  })
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
