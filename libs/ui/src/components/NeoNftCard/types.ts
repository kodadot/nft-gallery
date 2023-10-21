export type NeoNFT = {
  id: string
  name: string
  image: string
  animationUrl?: string
  mimeType?: string
  supply?: number
  price?: string
  cheapest?: {
    price: string
  }
  collection: {
    id: string
    name: string
  }
}
