export type BaseMintedCollection = {
  id: string
  alreadyMinted: number
  metadata: string
  name?: string
}

export type BaseTokenType<T = BaseMintedCollection> = {
  name: string
  file: File | null
  description: string
  selectedCollection: T | null
  edition: number
  secondFile: File | null
}

export type CarouselNFT = {
  currentOwner: string
  id: string
  image: string
  animationUrl: string | null
  issuer: string
  meta: {
    id: string
    image: string
  }
  name: string
  price: string
  timestamp: string
  unixTime: number
  metadata?: string
  collection?: {
    id: string
    name: string
  }
  collectionId?: string
  collectionName?: string
  chain?: string
}
