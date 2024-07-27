import type {
  Collection,
  RmrkCreatedNft } from './scheme'

export type MintType = {
  collection: Collection
  nfts: RmrkCreatedNft[]
}

export const basicUpdateFunction = (name: string, index: number): string =>
  `${name} #${index + 1}`
