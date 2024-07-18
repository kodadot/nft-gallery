export enum Status {
  Ok = 'Ok',
  Incomplete = 'Incomplete',
  Description = 'Description',
  Price = 'Price',
  Optional = 'Optional',
}

export type NFT = {
  id: number
  imageUrl: string
  name?: string
  file: File
  description?: string
  price?: number
  status?: Status
}

export type NFTToMint = {
  name: string
  file: File
  description?: string
  price?: number
}

export type NFTS = { [id: string]: NFT }
