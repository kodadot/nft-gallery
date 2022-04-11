import { formatDistanceToNow } from 'date-fns'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'

import { CarouselNFT } from '@/components/base/types'

/**
 * Format the data to fit with CarouselNFT[]
 * Get cloudflare images
 * Update timestamp
 */
export const formatNFT = async (data): Promise<CarouselNFT[]> => {
  if (!data) {
    return []
  }

  const images = await getCloudflareImageLinks(data.map((nft) => nft.meta.id))
  const imageOf = getProperImageLink(images)

  return data.map((nft) => ({
    ...nft,
    timestamp: formatDistanceToNow(new Date(nft.updatedAt), {
      addSuffix: true,
    }),
    image: imageOf(nft.meta.id, nft.meta.image),
  }))
}
