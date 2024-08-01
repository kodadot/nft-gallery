import type { Interaction } from '@kodadot1/minimark/v1'
import type {
  Interaction as InteractionType,
  NFTMetadata,
} from '@/components/rmrk/service/scheme'

export type NFTExcludingEvents = {
  currentOwner: string
  name: string
  price?: string
  metadata: string
  meta: NFTMetadata
  updatedAt: string
  id: string
}

export type InteractionWithNFT = InteractionType & {
  nft: NFTExcludingEvents
  timestamp: number
}

export const OfferInteraction = 'Offer'
export type Offer = {
  caller: string
  expiration: string
  status: string
  price: number
  timestamp: number
  interaction: string
  nft: NFTExcludingEvents
}

export type NFTHistoryState = {
  owner: string
  nft: NFTExcludingEvents
  latestInteraction: Interaction
  latestPrice: number
}
export type NFTMap = {
  [nftId: string]: NFTHistoryState
}
export type FlipEvent = {
  nft: NFTExcludingEvents
  soldPrice: number
  soldTo: string
  sellTimeStamp: number
  boughtPrice: number
  profit: number
}

export type Flippers = {
  [identity: string]: {
    flips: FlipEvent[]
    owned: number
    totalBought: number
    totalsold: number
    bestFlip: number
    latestflipTimestamp: number
  }
}
export type Owners = {
  [identity: string]: {
    nftCount: number
    totalBought: number
    totalSold: number
    nfts: NFTExcludingEvents[]
    lastActivityTimestamp: number
  }
}
