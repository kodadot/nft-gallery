import { Interaction } from '@kodadot1/minimark/v1'
import { Attribute } from '@kodadot1/minimark/common'

export { Attribute }

export interface CollectionMetadata {
  description?: string
  attributes: Attribute[]
  external_url?: string
  image?: string
  image_data?: string
}

export interface RmrkMint {
  version: string
  name: string
  max: number
  issuer: string
  symbol: string
  id: string
  metadata: string
}

// 'rmrk::MINTNFT::{"collection":"241B8516516F381A-OKSM","name":"Kusama Tetrahedron","transferable":1,"sn":"0000000000000002","metadata":"ipfs://ipfs/QmbT5DVZgoLP4PJRKWDRr85SowufraCgmvHehHKtkXqcEq"}';
export interface RmrkView {
  collection: string
  name: string
  instance: string
  transferable: number
  sn: string
  metadata: string
}

export interface RmrkInteraction {
  id: string
  metadata?: string
}

export enum MediaType {
  VIDEO = 'Video',
  MODEL = 'Model',
  IMAGE = 'Image',
  AUDIO = 'Audio',
  JSON = 'Json',
  TEXT = 'Text',
  IFRAME = 'IFrame',
  UNKNOWN = '',
  OBJECT = 'Object',
}

export interface RMRK {
  event: Interaction
  view: RmrkType
}

export type RmrkType = RmrkView | RmrkMint | RmrkInteraction

export interface IFrame {
  width?: string
  height?: string
  customUrl?: string
}

export const emptyIframe: IFrame = {
  width: '480px',
  height: '840px',
}
