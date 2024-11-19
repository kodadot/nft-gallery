import type {
  CollectionFloorPrice,
  EntityWithId,
  NFTMetadata,
} from '@/types'

export type MakingOfferItem = {
  urlPrefix: string
  price?: string
  highestOffer?: string
  offerPrice?: string
  offerExpiration?: number
  id: string
  name: string
  currentOwner: string
  collection: EntityWithId & CollectionFloorPrice
  meta?: NFTMetadata
  metadata: string
  sn: string
}
