import { sanitizeIpfsUrl } from '../utils'

export interface CompletePack extends BasePack {
  collections: Collection[];
  nfts: NFT[];
}

export interface CompletePackWithItemMeta extends BasePack {
  collections: CollectionWithMeta[];
  nfts: NFTWithMeta[];
}

export interface Attribute {
  display_type: DisplayType;
  trait_type: string;
  value: number | string;
}

export enum DisplayType {
  null,
  'boost_number',
  'number',
  'boost_percentage'
}

export interface State {
  getAllCollections(): Promise<Collection[]>;
  getNFTsForCollection(id: string): Promise<NFT[]>;
  getNFT(id: string): Promise<NFT>;
  getCollection(id: string): Promise<Collection>;
  getNFTsForAccount(account: string): Promise<NFT[]>;
  getLastSyncedBlock(): Promise<number>;
  refresh(): Promise<State>;
}


export interface NFTMetadata {
  external_url?: string;
  image?: string;
  image_data?: string;
  description?: string;
  name: string;
  attributes: Attribute[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}


export interface CollectionMetadata {
  description?: string;
  attributes: Attribute[];
  external_url?: string;
  image?: string;
  image_data?: string;
}

export interface PackMetadata {
  social: Record<string, string>;

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
  imageArId?: string;
  metadataArId?: string;
  animationArId?: string;
}

export interface CollectionWithMeta extends Collection, CollectionMetadata, Arweave {

}

export interface NFTWithMeta extends NFT, NFTMetadata, Arweave {

}

// id me
export interface Emotion {
  _id: string;
  remarkId: string;
  issuer: string;
  metadata: string;
}

export interface Collection {
  version: string;
  name: string;
  max: number;
  issuer: string;
  symbol: string;
  id: string;
  _id: string;
  metadata: string;
  blockNumber?: number;
}

export interface NFT {
  name: string;
  instance: string;
  transferable: number;
  collection: string
  sn: string;
  _id: string;
  id: string;
  metadata: string;
  currentOwner: string;
  price?: string;
  disabled?: boolean;
  blockNumber?: number;
}

export interface BasePack {
  _id: string;
  id: string;
  owner: string;
  name: string;
  image?: string;
  description?: string;
  metadata?: string;
}

export interface Pack extends BasePack {
  collections: Record<string, boolean>;
  nfts: Record<string, boolean>;
  social?: Record<string, string>;
}

export const getNftId = (nft: NFT, blocknumber?: string | number): string => {
  return `${blocknumber ? blocknumber + '-' : '' }${nft.collection}-${nft.instance || nft.name}-${nft.sn}`
}

export const computeAndUpdateNft = (nft: NFT, blocknumber?: string | number): NFT => {
  const id = getNftId(nft, blocknumber)
  return {
    ...nft,
    _id: id,
    id
  }
}

export const computeAndUpdateCollection = (collection: Collection): Collection => {
  return {
    ...collection,
    _id: collection.id
  }
}

export const mergeCollection = (collection: Collection, metadata: CollectionMetadata, shouldSanitize: boolean = false): CollectionWithMeta => ({
  ...collection,
  ...metadata,
  image: shouldSanitize ? sanitizeIpfsUrl(metadata.image || '') : metadata.image
})


export const mergeNFT = (nft: NFT, metadata: NFTMetadata, shouldSanitize: boolean = false): NFTWithMeta => ({
  ...nft,
  ...metadata,
  image: shouldSanitize ? sanitizeIpfsUrl(metadata.image || '') : metadata.image
})
