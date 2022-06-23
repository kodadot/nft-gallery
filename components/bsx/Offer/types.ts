export type Offer = {
  id: string
  caller: string
  expiration: string
  price: string
}

export type OfferResponse = {
  offers: Offer[]
  stats: {
    total: number
  }
}
