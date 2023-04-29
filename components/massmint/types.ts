import { BaseMintedCollection } from '../base/types'

export type MintedCollection = BaseMintedCollection & {
  name?: string
  lastIndexUsed: number
}

export enum Status {
  Ok = 'Ok',
  Incomplete = 'Incomplete',
  Description = 'Description',
  Price = 'Price',
  Optional = 'Optional',
}

export type NFT = {
  fileName: string
  id: number
  imageUrl: string
  name?: string
  description?: string
  price?: number
  status?: Status
}

export type NFTS = { [id: string]: NFT }
