export type NeoNFT = {
  id: string
  name: string
  image: string
  animationUrl?: string
  mimeType?: string
  supply?: number
  createdAt?: string
  price?: string
  sn?: string
  cheapest?: {
    price: string
  }
  collection: {
    id: string
    name: string
  }
}

export type NftCardVariant =
  | 'primary'
  | 'minimal'
  | 'stacked-primary'
  | 'stacked-minimal'
