export type Status = 'Ok' | 'Incomplete' | 'Description'

export type NFT = {
  id: number
  imageUrl: string
  name?: string
  description?: string
  price?: number
  status?: Status
}

export type NFTS = { [id: string]: NFT }
