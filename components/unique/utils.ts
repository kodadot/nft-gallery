import BN from 'bn.js'

export const tokenIdToRoute = (
  tokenId: string
): { id: string; item: string } => {
  const [collection, item] = tokenId.split('-')
  return {
    id: collection,
    item,
  }
}

export const createTokenId = (collection: string, id: string): string =>
  `${collection}-${id}`

export const getRandomValues = (length: number): number[] => {
  const values = new Uint32Array(length)
  window.crypto.getRandomValues(values)
  return Array.from(values)
}

export const hasEnoughToken = (balance: string, ...fees: string[]): boolean => {
  const balanceAmount = new BN(balance)
  const zero = new BN(0)
  const feesAmount = fees.map((fee) => new BN(fee))
  return feesAmount
    .reduce((total, fee) => total.add(fee), zero)
    .lt(balanceAmount)
}
