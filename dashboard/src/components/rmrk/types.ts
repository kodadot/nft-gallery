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

export interface RmrkInteraction {
  id: string;
  metadata?: string;
}

export enum RmrkEvent {
  MINT = 'MINT',
  MINTNFT = 'MINTNFT',
  LIST = 'LIST',
  BUY = 'BUY',
  CONSUME = 'CONSUME',
  CHANGEISSUER = 'CHANGEISSUER',
  SEND = 'SEND',
  EMOTE = 'EMOTE',
}


export enum MediaType {
  VIDEO = 'Video',
  MODEL = 'Model',
  IMAGE = 'Image',
  AUDIO = 'Audio',
  JSON = 'Json',
  TEXT = 'Text',
  IFRAME = 'IFrame',
  UNKNOWN = ''
}

export interface RMRK {
  event: RmrkEvent;
  view: RmrkType;
}

export type RmrkType = RmrkView | RmrkMint | RmrkInteraction

export interface IFrame {
  width?: string;
  height?: string;
  customUrl?: string;
}

export const emptyIframe: IFrame = {
  width: '480px',
  height: '840px'
}

