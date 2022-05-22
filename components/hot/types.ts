// import { Event } from '@/components/rmrk/types'
type NFT = {
  collection: {
    id: string
    name: string
  }
}

export interface SubsquidHotNft {
  interaction: string
  meta: string
  nft: NFT
  timestamp: string
}

export interface RowHot {
  collectionId: string
  name: string
  totalVolume: string
  buys: number
  latestSoldSize: string
  latestSoldTime: string
  medianDate: string
  nfts: [SubsquidHotFeed]
}
