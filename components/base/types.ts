import { ItemResources } from '@/composables/useNft'
import type { Prefix } from '@kodadot1/static'

export type BaseMintedCollection = {
  id: string
  alreadyMinted: number
  metadata: string
  name?: string
  lastIndexUsed: number
}

export type BaseTokenType<T = BaseMintedCollection> = {
  name: string
  file: File | null
  description: string
  selectedCollection: T | null
  copies: number
  secondFile: File | null
}

export interface CarouselNFT extends ItemResources {
  currentOwner: string
  id: string
  image: string
  animationUrl: string | null
  issuer: string
  meta: {
    id: string
    image: string
  }
  name: string
  price: string
  latestSalePrice?: string
  timestamp: string
  unixTime: number
  metadata?: string
  collection?: {
    id: string
    name: string
  }
  collectionId?: string
  collectionName?: string
  chain?: Prefix
}

export interface BaseNFTMeta {
  id: string
  image?: string
  animationUrl?: string
  animation_url?: string
  name?: string
  description?: string
  type?: string
}
