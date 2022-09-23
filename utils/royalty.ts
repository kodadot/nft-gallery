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

export const royaltyOf = (
  amount: number | string | bigint,
  percent: number | bigint
): string => {
  return String((BigInt(amount) * BigInt(percent || 0)) / BigInt(100))
}
