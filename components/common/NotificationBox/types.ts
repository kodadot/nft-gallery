import type { CarouselNFT } from '@/components/base/types'
import type { Interaction } from '@/components/rmrk/service/scheme'
export type FilterOption = {
  id: string
  name: string
}

export declare interface Event extends Interaction {
  nft: CarouselNFT & {
    meta: {
      name: string
    }
  }
}
