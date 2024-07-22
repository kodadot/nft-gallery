import correctFormat from '~/utils/ss58Format'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { useChainStore } from '@/stores/chain'

export type ShuffleFunction = (arr: string[]) => string[]
export type ProcessFunction = (nfts: string[] | AdminNFT[]) => string[]
export type SendType = {
  parsedAddresses: string[]
  distribution: number
  random: boolean
}

export type AdminNFT = { id: string; price: string }

export const toDistribute = (length: number, distribution: number): number => {
  return Math.floor((length * distribution) / 100)
}

export const parseBatchAddresses = (batchAddresses: string): string[] => {
  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format
  const addresses = batchAddresses
    .split('\n')
    .map((x) => x.split('-'))
    .filter((x) => x.length)
    .map((x) => x[1])
    .filter((x) => x)
    .map((a) => a.trim())
  const onlyValid = addresses
    .filter((a) => isAddress(a))
    .map((a) => encodeAddress(a, correctFormat(ss58Format)))

  return onlyValid
}

export const shuffleFunction =
  (seed: number[]): ShuffleFunction =>
  (array: string[]): string[] =>
    shuffle(array, seed)

export function shuffle(array: string[], seed: number[]): string[] {
  const copy = array.slice(0)
  const len = seed.length - 1
  const total = array.length - 1
  // eslint-disable-next-line no-restricted-syntax
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(seed[i % len] * (i + 1)) % total
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

// api.query.babe.randomness()
