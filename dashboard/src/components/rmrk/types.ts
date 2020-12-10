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

export interface CollectionMetadata {
  description?: string;
  attributes: Attribute[];
  external_url?: string;
  image?: string;
  image_data?: string;
}

export interface RmrkMint {
   version: string;
   name: string;
   max: number;
   issuer: string;
   symbol: string;
   id: string;
   metadata: string;
}

// 'rmrk::MINTNFT::{"collection":"241B8516516F381A-OKSM","name":"Kusama Tetrahedron","transferable":1,"sn":"0000000000000002","metadata":"ipfs://ipfs/QmbT5DVZgoLP4PJRKWDRr85SowufraCgmvHehHKtkXqcEq"}';
export interface RmrkView {
   collection: string;
   name: string;
   instance: string;
   transferable: number;
   sn: string;
   metadata: string;
}

export enum RmrkAction {
  MINT = 'MINT',
  MINTNFT = 'MINTNFT'
}


export enum MediaType {
  VIDEO = 'Video',
  IMAGE = 'Image',
  AUDIO = 'Audio',
  JSON = 'Json',
  TEXT = 'Text',
  UNKNOWN = ''
}

export interface RMRK {
  action: RmrkAction;
  view: RmrkType;
}

export type RmrkType = RmrkView | RmrkMint
