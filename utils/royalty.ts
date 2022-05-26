export type Royalty = {
  amount: number
  address: string
}

export const isRoyaltyValid = (royalty: Royalty): boolean => {
  if (!royalty.amount || !royalty.address) {
    return false
  }

  return true
}
