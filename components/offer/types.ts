import type {
  CollectionFloorPrice,
  EntityWithId,
  NFTMetadata,
} from '@/components/rmrk/service/scheme'

export type MakingOfferItem = {
  urlPrefix: string
  price?: string
  offerPrice?: string
  id: string
  name: string
  currentOwner: string
  collection: EntityWithId & CollectionFloorPrice
  meta?: NFTMetadata
  metadata: string
  sn: string
}
