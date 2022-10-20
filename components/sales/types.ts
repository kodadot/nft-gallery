export interface SubsquidSalesFeed {
  id: string
  buyer: string
  collectionId: string
  collectionName: string
  image: string | null
  issuer: string
  name: string
  salePrice: string
  timestamp: string
  blockNumber: string
}

export interface RowSales extends SubsquidSalesFeed {
  idx: Int
  image: string
  date: Date
  relDate: string
}
