export type FilterOption = {
  id: string
  name: string
}

interface NFT {
  name: string
  id: string
  price: string
  metadata: string
  meta: {
    id: string
    image: string
  }
  collection: {
    id: string
  }
}

export type Event = {
  id: string
  interaction: string
  timestamp: string
  caller: string
  nft: NFT
}
