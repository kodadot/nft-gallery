import { formatDistanceToNow } from 'date-fns'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'

import { CarouselNFT } from '@/components/base/types'
import { processSingleMetadata } from '~/utils/cachingStrategy'
import { LastEvent } from '~/utils/types/types'
/**
 * Format the data to fit with CarouselNFT[]
 * Get cloudflare images
 * Update timestamp
 */
export const formatNFT = async (nfts): Promise<CarouselNFT[]> => {
  if (!nfts) {
    return []
  }

  const data = nfts.filter((nft) => Boolean(nft.meta))
  const images = await getCloudflareImageLinks(data.map((nft) => nft.meta.id))
  const imageOf = getProperImageLink(images)

  return data.map((nft) => ({
    ...nft,
    timestamp: formatDistanceToNow(new Date(nft.updatedAt), {
      addSuffix: true,
    }),
    image: imageOf(nft.meta.id, nft.meta.image),
    animationUrl: imageOf(nft.meta.id, nft.meta.animationUrl) || '',
  }))
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

export const convertLastEventToNft = (e: LastEvent) => {
  return {
    meta: e.meta,
    timestamp: e.timestamp,
    nft: {
      id: e.id,
      name: e.name,
      issuer: e.issuer,
      currentOwner: e.currentOwner,
      metadata: e.metadata,
      meta: {
        id: e.metadata,
        image: e.image,
      },
    },
  }
}
