import store from '@/store'
import correctFormat from '@/utils/ss58Format'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import NFTUtils from '../rmrk/service/NftUtils'

export type ProcessFunction = (nfts: string[] | AdminNFT[], version: string) => string[]
export type SendType = {
  parsedAddresses: string[],
  distribution: number,
  random: boolean
}

export type AdminNFT = { id: string, price: string }


export const parseBatchAddresses = (batchAddresses: string): string[] => {
  const ss58Format = store.getters.getChainProperties?.ss58Format
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


export const sendFunction = (parsedAddresses: string[], distribution: number, random: boolean): ProcessFunction => {
  const randomFn = random ? randomSort : undefined
  const slice = Math.floor(parsedAddresses.length * distribution / 100)
  const subset = parsedAddresses.sort(randomFn).slice(0, slice)
  return (nfts: string[] | AdminNFT[], version: string) => {

    const lessTokensThanAdresses = nfts.length < subset.length
    const final = subset.slice(0, lessTokensThanAdresses ? nfts.length : undefined)
    return final.map((addr, index) => NFTUtils.createInteraction('SEND', version, justId(nfts[index]), String(addr)))
  }
}

const justId = (nft: AdminNFT | string) => typeof nft === 'object' ? nft.id : nft


//TODO: skip if already in the list
function randomSort(): 1 | -1 {
  return (Math.random() > .5) ? 1 : -1
}

// api.query.babe.randomness()
