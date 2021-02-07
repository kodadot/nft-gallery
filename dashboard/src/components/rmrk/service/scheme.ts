interface Astronaut {
  name: string;
  missions: number;
  _id: string;
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

// export class rmkNFT {
//    collection: Collection;
//    name: string;
//    instance: string;
//    transferable: number;
//    sn: string;
//    metadata: NFTMetadata;
//   static mintnft(): rmkNFT {
//     return new rmkNFT();
//   }
//   id(): string {
//     return `${this.collection.id}-${this.instance}-${this.sn}`;
//   }
//   send(): rmkNFT {
//     return this;
//   }
//   consume(): rmkNFT {
//     return this;
//   }
//   list(): rmkNFT {
//     return this;
//   }
//   buy(): rmkNFT {
//     return this;
//   }
// }

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

// export class rmkCollection {
//    version: string;
//    name: string;
//    max: number;
//    issuer: string;
//    symbol: string;
//    id: string;
//    metadata: CollectionMetadata;
//   static mint(): rmkCollection {
//     return new rmkCollection();
//   }
//   change_issuer(): rmkCollection {
//     return this;
//   }
// }

export interface CollectionMetadata {
  description?: string;
  attributes: Attribute[];
  external_url?: string;
  image?: string;
  image_data?: string;
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

export interface CollectionWithMeta extends Collection, CollectionMetadata {

}

export interface NFTWithMeta extends NFT, NFTMetadata {

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
