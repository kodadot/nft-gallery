import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import correctFormat from '~/utils/ss58Format'
import { useChainStore } from '@/stores/chain'

export type ProcessFunction = (nfts: string[] | AdminNFT[]) => string[]
export type SendType = {
  parsedAddresses: string[]
  distribution: number
  random: boolean
}

export type AdminNFT = { id: string, price: string }

export const parseBatchAddresses = (batchAddresses: string): string[] => {
  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format
  const addresses = batchAddresses
    .split('\n')
    .map(x => x.split('-'))
    .filter(x => x.length)
    .map(x => x[1])
    .filter(x => x)
    .map(a => a.trim())
  const onlyValid = addresses
    .filter(a => isAddress(a))
    .map(a => encodeAddress(a, correctFormat(ss58Format)))

  return onlyValid
}
