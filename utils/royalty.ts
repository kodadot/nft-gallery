import { isAddress } from '@polkadot/util-crypto'
import consola from 'consola'

export type Royalty = {
  amount: number
  address: string
}

export const isRoyaltyValid = ({ amount, address }: Royalty): boolean => {
  const result = amount > 0 && isAddress(address)
  console.log(
    `Royalty is valid: ${result}, amount: ${amount}, address: ${address}`
  )
  return result
}
