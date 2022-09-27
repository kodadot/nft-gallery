import { isAddress } from '@polkadot/util-crypto'

export type Royalty = {
  amount: number
  address: string
}

export const isRoyaltyValid = ({ amount, address }: Royalty): boolean => {
  const result = amount > 0 && amount < 100 && isAddress(address)
  console.log(
    `Royalty is valid: ${result}, amount: ${amount}, address: ${address}`
  )
  return result
}

export const royaltyOf = (amount: number | string, percent: number): string => {
  return String((Number(amount) * Number(percent || 0)) / Number(100))
}
