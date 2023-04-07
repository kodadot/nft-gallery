import type { CarouselNFT } from '@/components/base/types'

export type FilterOption = {
  id: string
  name: string
}

export type Event = {
  id: string
  interaction: string
  timestamp: string
  caller: string
  meta: number
  nft: CarouselNFT & {
    meta: {
      name: string
    }
  }
}
