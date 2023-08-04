import { EntityWithId, NFTMetadata } from '../../rmrk/service/scheme'
import { Royalty } from '@/utils/royalty'

export type ShoppingCartItem = {
  urlPrefix: string
  price: string
  id: string
  name: string
  currentOwner: string
  royalty?: Royalty
  collection: EntityWithId
  addedAt: number
  meta?: NFTMetadata
  metadata: string
}
