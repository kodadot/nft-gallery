import type { Attribute } from '@kodadot1/minimark/common'
import type { Prefix } from '@kodadot1/static'
import type { TokenMetadata } from '@kodadot1/hyperdata'

// TODO: remove this
export interface Metadata {
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
  meta?: TokenMetadata
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
  events: Interaction[]
  name: string
  instance: string
  transferable: number
  collection: EntityWithId & CollectionFloorPrice
  collectionId?: string
  sn: string
  _id: string
  id: string
  metadata: string
  currentOwner: string
  issuer: string
  price?: string
  burned?: boolean
  blockNumber?: number
  emoteCount?: number
  royalty?: number
  recipient?: string
  meta?: NFTMetadata
  parent?: NFT
}

export type CollectionMetadata = Metadata

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
