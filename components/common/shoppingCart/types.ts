import type {
  CollectionFloorPrice,
  EntityWithId,
  NFTMetadata,
} from '@/types'

import type { Royalty } from '@/utils/royalty'

export type ShoppingCartItem = {
  urlPrefix: string
  price: string
  id: string
  name: string
  currentOwner: string
  royalty?: Royalty
  collection: EntityWithId & CollectionFloorPrice
  addedAt: number
  meta?: NFTMetadata
  metadata: string
  sn: string
}
