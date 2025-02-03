import type {
  CollectionFloorPrice,
  EntityWithId,
  NFTMetadata,
} from '@/types'
import { type SwapSurchargeDirection } from '@/composables/transaction/types'

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

export enum TradeStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  WITHDRAWN = 'WITHDRAWN',
  ACCEPTED = 'ACCEPTED',
}

export type TradeToken = {
  id: string
  name: string
  sn: string
  currentOwner: string
  image: string
  collection: {
    id: string
  }
  meta: Record<string, unknown>
}

export type TradeConsidered = {
  id: string
  name: string
  currentOwner: string
  image: string
}

export type BaseTrade = {
  id: string
  price: string
  expiration: string
  blockNumber: string
  status: TradeStatus
  caller: string
  offered: TradeToken
  desired: TradeToken | null
  considered: TradeConsidered
  createdAt: Date
  surcharge: SwapSurchargeDirection | null
}

export enum TradeDesiredTokenType {
  SPECIFIC,
  ANY_IN_COLLECTION,
}

export enum TradeType {
  SWAP = 'swap',
  OFFER = 'offer',
}

export type Swap = BaseTrade

export type Offer = BaseTrade

type Trade = Swap | Offer

export type TradeTarget = {
  id: string
  currentOwner: string
}

export type TradeNftItem<T = Trade> = T & {
  expirationDate: Date
  type: TradeType
  desiredType: TradeDesiredTokenType
  isAnyTokenInCollectionDesired: boolean
  targets: TradeTarget[]
  isExpired: boolean
}
