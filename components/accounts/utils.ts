import * as store from '~/store'
import correctFormat from '~/utils/ss58Format'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import NFTUtils from '../rmrk/service/NftUtils'

export type ShuffleFunction = (arr: string[]) => string[]
export type ProcessFunction = (nfts: string[] | AdminNFT[], version: string) => string[]
export type SendType = {
  parsedAddresses: string[],
  distribution: number,
  random: boolean
}

export type AdminNFT = { id: string, price: string }

export const toDistribute = (length: number, distribution: number): number => {
  return Math.floor(length * distribution / 100)
}

export const parseBatchAddresses = (batchAddresses: string): string[] => {
  const ss58Format: any = store.getters['chain/getChainProperties58Format']
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


export const sendFunction = (parsedAddresses: string[], distribution: number, random?: ShuffleFunction): ProcessFunction => {
  const randomFn = random ? random : notRandomFunction
  const slice = toDistribute(parsedAddresses.length, distribution)
  const subset = randomFn(Array.from(new Set(parsedAddresses))).slice(0, slice)
  return (nfts: string[] | AdminNFT[], version: string) => {

    const lessTokensThanAdresses = nfts.length < subset.length
    const final = subset.slice(0, lessTokensThanAdresses ? nfts.length : undefined)
    return final.map((addr, index) => NFTUtils.createInteraction('SEND', version, justId(nfts[index]), String(addr)))
  }
}

const justId = (nft: AdminNFT | string) => typeof nft === 'object' ? nft.id : nft


//TODO: skip if already in the list
function notRandomFunction(array: string[]): string[]  {
  return array
}

export const shuffleFunction = (seed: number[]): ShuffleFunction => (array: string[]): string[] => shuffle(array, seed)

export function shuffle(array: string[], seed: number[]): string[] {
  const copy = array.slice(0)
  const len = seed.length - 1
  const total = array.length - 1
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(seed[i % len] * (i + 1)) % total
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}


// api.query.babe.randomness()
