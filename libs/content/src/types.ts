export type OpenSeaAttribute = {
  display_type?: string
  trait_type: string
  value: number | string
}

export type TokenMetadata = {
  name?: string
  description: string
  external_url?: string
  image: string
  animation_url?: string
  attributes?: OpenSeaAttribute[]
  mediaUri?: string
  type?: string
  thumbnailUri?: string
}

export type BaseMetadata = {
  name: string
  description: string
}

export type BaseOpenMetadata = {
  image: string
  animation_url?: string
}

export type Tags = string[]

export type OpenSeaMetadata = BaseMetadata &
  BaseOpenMetadata & {
    attributes?: OpenSeaAttribute[]
    external_url?: string
    background_color?: string
    youtube_url?: string
  }

export type TezosAttribute = {
  name: string
  value: string
  type?: string
}

export type BaseTezosMetadata = {
  thumbnailUri?: string
  externalUri?: string
}

export type WithTags = {
  tags?: Tags
}

// https://tzip.tezosagora.org/proposal/tzip-21/
export type TezosMetadata = BaseMetadata &
  BaseTezosMetadata & {
    displayUri?: string
    artifactUri?: string
    attributes?: TezosAttribute[]
    tags?: Tags
    type?: string
    formats?: TezosFormat[]
  }

// https://www.fxhash.xyz/doc/fxhash/integration-guide
export type GenerativeMetadata = {
  generativeUri: string
  generatorUri: string
  previewHash: string
}

export type FXHashMetadata = TezosMetadata & GenerativeMetadata

export type TezosFormat = {
  uri: string
  hash: string
  mimeType: string
  dimensions: {
    value: `${number}x${number}`
    unit: string
  }
}

export type PluralAttribute = {
  label: string
  type?: string
  value: string
  // For backward compatibility
  trait_type?: string
  display_type?: string
}

// https://eips.ethereum.org/EIPS/eip-5773
export type PluralAssetMetadata = BaseMetadata &
  BaseTezosMetadata &
  BaseOpenMetadata & {
    mediaUri?: string
    attributes?: PluralAttribute[]
  }

export type LensMetadata = {
  nsfw: boolean
}

export type PossibleMetadata =
  | OpenSeaMetadata
  | TezosMetadata
  | PluralAssetMetadata
  | FXHashMetadata
export type PossibleAttribute =
  | OpenSeaAttribute
  | TezosAttribute
  | PluralAttribute

export type AllMetadata = OpenSeaMetadata &
  TezosMetadata &
  PluralAssetMetadata &
  FXHashMetadata

// TARGETS

export type Content = {
  animationUrl: string
  attributes: Attribute[]
  description: string
  // id: string
  image: string
  name: string
  type?: string
  tags?: Tags
  externalUrl?: string
  thumbnail?: string
}

export type Attribute = {
  display?: string
  trait: string
  value: string
}

export type GenArt = {
  uri: string
  previewParam: string
  previewHash: string
  capture: Record<string, unknown>
  settings: Record<string, unknown>
}

export type SanitizerFunc = <T = string>(url: T | undefined) => T
