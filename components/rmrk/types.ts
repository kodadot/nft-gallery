import { Attribute as IAttribute } from '@kodadot1/minimark/common'

export type Attribute = IAttribute

export interface CollectionMetadata {
  description?: string
  attributes: Attribute[]
  external_url?: string
  image?: string
  image_data?: string
}

export enum MediaType {
  VIDEO = 'Video',
  MODEL = 'Model',
  IMAGE = 'Image',
  AUDIO = 'Audio',
  JSON = 'Json',
  TEXT = 'Text',
  IFRAME = 'IFrame',
  UNKNOWN = 'Unknown',
  OBJECT = 'Object',
}

export interface IFrame {
  width?: string
  height?: string
  customUrl?: string
}

export const emptyIframe: IFrame = {
  width: '480px',
  height: '840px',
}
