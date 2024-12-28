import type { TokenMetadata, CollectionMetadata as CollectionMeta } from '@kodadot1/hyperdata'
import type { Prefix } from '@kodadot1/static'

// TODO: remove this
export interface Metadata<T = TokenMetadata> {
  id: string
  description?: string
  attributes?: Attribute[]
  external_url?: string
  image?: string
  image_data?: string
  type?: string
  thumbnailUri?: string
  mediaUri?: string
  chain?: Prefix
  meta?: T
}

export interface NFTMetadata extends Metadata {
  name: string
  mediaUri?: string
  background_color?: string
  animation_url?: string
  animationUrl?: string
  mimeType?: string
  youtube_url?: string
  type?: string
  image_ar?: string
  properties?: Record<string, { value: string, type: string }>
  unlockable?: boolean
  sn?: string
}

export interface NFT {
  _id: string
  id: string
  sn: string
  blockNumber?: number
  name: string
  attributes: Attribute[]
  burned?: boolean
  collection: EntityWithId & CollectionFloorPrice
  collectionId?: string
  currentOwner: string
  events: Interaction[]
  hash: string
  image?: string
  issuer: string
  lewd: boolean
  media?: string
  meta?: NFTMetadata
  metadata: string
  price?: string
  parent?: NFT
  recipient?: string
  royalty?: number
  transferable: number
  createdAt: string
  updatedAt: string
  version: number
}

export interface Attribute {
  display?: string
  trait?: string
  value: string
}

export type CollectionMetadata = Metadata<CollectionMeta>

export type MassMintNFT = {
  name: string
  description: string
  meta: number | string
  file?: File
}

export interface CollectionWithMeta
  extends Collection,
  CollectionMetadata {
  nfts?: NFT[]
  collection_id?: string
  totalCount?: number
  floorPrice?: number
}

export interface NFTWithMeta extends NFT {}

export interface Collection {
  version: string
  name: string
  max: number
  issuer: string
  symbol: string
  id: string
  _id: string
  metadata: string
  blockNumber?: number
}

export type CollectionFloorPrice = { floorPrice: { price: string }[] }

export interface TokenId {
  token?: {
    id: string
  }
}

export type EntityWithId = {
  id: string
  name: string
  currentOwner: string
  floor: string
}

interface BaseInteraction {
  id: string
  interaction: string
  meta: string
}

export interface ActivityInteraction extends BaseInteraction {
  timestamp: number
}

export interface Interaction extends BaseInteraction {
  blockNumber: string | number
  caller: string
  currentOwner: string
  timestamp: string
}
