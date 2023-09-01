import { MIME_TYPE } from './constatnts'
import {
  Attribute,
  Content,
  FXHashMetadata,
  OpenSeaAttribute,
  OpenSeaMetadata,
  PluralAssetMetadata,
  PluralAttribute,
  SanitizerFunc,
  TezosAttribute,
  TezosMetadata,
} from './types'

export function attributeFrom(attr: OpenSeaAttribute): Attribute
export function attributeFrom(attr: TezosAttribute): Attribute
export function attributeFrom(attr: PluralAttribute): Attribute
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attributeFrom(attr: any): Attribute {
  const display: string = attr.display_type || attr.type || ''
  const trait: string | undefined = attr.trait_type || attr.name || attr.label
  const value: string = attr.value?.toString()

  return {
    display,
    trait: trait?.toString() ?? '',
    value,
  }
}

export function contentFrom(meta: OpenSeaMetadata): Content
export function contentFrom(meta: FXHashMetadata): Content
export function contentFrom(meta: TezosMetadata): Content
export function contentFrom(meta: PluralAssetMetadata): Content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function contentFrom(meta: any): Content {
  const description = meta.description || ''
  const thumbnail = meta.thumbnailUri || meta.thumbnail
  const image = meta.image || meta.displayUri || thumbnail || meta.mediaUri
  const animationUrl = meta.animation_url || meta.mediaUri || meta.artifactUri
  const attributes = meta.attributes?.map(attributeFrom) || []
  const name = meta.name
  const type = meta.type
  const externalUrl = meta.external_url || meta.youtube_url || meta.externalUri
  const tags = Array.isArray(meta.tags) ? meta.tags : []

  return {
    description,
    image,
    animationUrl, // rename to media?
    attributes,
    name,
    type: MIME_TYPE.test(type) ? type : '',
    externalUrl,
    tags,
    thumbnail,
  }
}

export function normalize(content: Content, sanitizer: SanitizerFunc): Content {
  return {
    ...content,
    image: sanitizer(content.image),
    animationUrl: sanitizer(content.animationUrl),
    thumbnail: sanitizer(content.thumbnail),
  }
}
