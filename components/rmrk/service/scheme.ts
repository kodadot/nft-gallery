import { Attribute, CreatedNFT } from '@kodadot1/minimark'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { ItemResources } from '@/composables/useNft'

export interface CompletePack extends BasePack {
  collections: Collection[]
  nfts: NFT[]
}

export type RmrkType = RmrkWithMetaType | Emotion | Pack
export type RmrkWithMetaType = CollectionWithMeta | NFTWithMeta
export type CollectionOrNFT = Collection | NFT

export interface CompletePackWithItemMeta extends BasePack {
  collections: CollectionWithMeta[]
  nfts: NFTWithMeta[]
}

export interface SimpleNFT {
  name: string
  max: number
  symbol: string
  tags: Attribute[]
  description: string
  metadata: string
}

export interface MintNFT {
  name: string
  edition: number
  tags: Attribute[]
  description: string
  nsfw: boolean
  file?: Blob
  secondFile?: Blob
  price: string | number
}

export interface State {
  getAllCollections(): Promise<Collection[]>
  getNFTsForCollection(id: string): Promise<NFT[]>
  getNFT(id: string): Promise<NFT>
  getCollection(id: string): Promise<Collection>
  getNFTsForAccount(account: string): Promise<NFT[]>
  getLastSyncedBlock(): Promise<number>
  refresh(): Promise<State>
}

export interface Metadata {
  id?: string
  description?: string
  attributes?: Attribute[]
  external_url?: string
  image?: string
  image_data?: string
  type?: string
}

export interface NFTMetadata extends Metadata, ItemResources {
  name: string
  mediaUri?: string
  background_color?: string
  animation_url?: string
  youtube_url?: string
  type?: string
  image_ar?: string
  properties?: Record<string, { value: string; type: string }>
}

export type CollectionMetadata = Metadata

export interface PackMetadata {
  social: Record<string, string>
}

export type MassMintNFT = {
  name: string
  description: string
  meta: number | string
  file?: File
}

// export interface Collection {
//   version: string;
//   name: string;
//   max: number;
//   issuer: string;
//   symbol: string;
//   id: string;
//   _id: string;
//   metadata: CollectionMetadata;
//   items: NFT[];
// }

// export interface NFT {
//   name: string;
//   instance: string;
//   transferable: number;
//   collection: string
//   sn: string;
//   _id: string;
//   id: string;
//   metadata: NFTMetadata;
//   currentOwner: string;
// }

export interface Arweave {
  imageArId?: string
  metadataArId?: string
  animationArId?: string
}

export interface CollectionWithMeta
  extends Collection,
    CollectionMetadata,
    Arweave {
  nfts?: NFT[]
}

export interface NFTWithMeta extends NFT, NFTMetadata, Arweave {}

export interface CollectionWithNFT extends Collection {
  nfts?: NFT[]
}

export type Emote = {
  caller: string
  value: string
}

// id me
export interface Emotion {
  _id: string
  remarkId: string
  issuer: string
  caller: string
  metadata: string
}

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

export interface NFT extends ItemResources {
  events: Interaction[]
  name: string
  instance: string
  transferable: number
  collection: EntityWithId
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
  emotes?: Emote[]
  royalty?: number
  meta?: NFTMetadata
}

export type EntityWithId = {
  id: string
  name: string
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

export interface BasePack {
  _id: string
  id: string
  owner: string
  name: string
  image?: string
  description?: string
  metadata?: string
}

export interface Pack extends BasePack {
  collections: Record<string, boolean>
  nfts: Record<string, boolean>
  social?: Record<string, string>
}

export interface CollectionEventsStats {
  max: string
  count: number
}

export interface NftEvents {
  nftEntities: {
    id: string
    name: string
    collection: Collection
    events: Interaction[]
  }[]
}

export interface CollectionEvents {
  collectionEntity: {
    blockNumber: string
    createdAt: string
    currentOwner: string
    id: string
    issuer: string
    metadata: string
    name: string
    nfts: NFT[]
  }
  nftEntitiesConnection: {
    totalCount: number
  }
}

export const getNftId = (nft: NFT, blocknumber?: string | number): string => {
  return `${blocknumber ? blocknumber + '-' : ''}${nft.collection.id}-${
    nft.instance || nft.name
  }-${nft.sn}`
}

export const toNFTId = (
  nft: CreatedNFT,
  blocknumber: string | number
): string => {
  const { collection, instance, sn } = nft
  if (!collection || !instance || !sn) {
    throw new ReferenceError('[APP] toNFTId: invalid nft')
  }

  return `${blocknumber}-${collection}-${instance}-${sn}`
}

export const computeAndUpdateNft = (
  nft: NFT,
  blocknumber?: string | number
): NFT => {
  const id = getNftId(nft, blocknumber)
  return {
    ...nft,
    _id: id,
    id,
  }
}

export const computeAndUpdateCollection = (
  collection: Collection
): Collection => {
  return {
    ...collection,
    _id: collection.id,
  }
}

export const mergeCollection = (
  collection: Collection,
  metadata: CollectionMetadata,
  shouldSanitize = false
): CollectionWithMeta => ({
  ...collection,
  ...metadata,
  image: shouldSanitize
    ? sanitizeIpfsUrl(metadata.image || '')
    : metadata.image,
})

export const mergeNFT = (
  nft: NFT,
  metadata: NFTMetadata,
  shouldSanitize = false
): NFTWithMeta => ({
  ...nft,
  ...metadata,
  image: shouldSanitize
    ? sanitizeIpfsUrl(metadata.image || '')
    : metadata.image,
})
