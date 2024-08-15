import type { Prefix } from '@kodadot1/static'
import { decodeAddress, encodeAddress, isEthereumAddress } from '@polkadot/util-crypto'
import { chainPropListOf } from '@/utils/config/chain.config'

export const toChainAddres = (address: string, prefix: Prefix) => {
  if (isEthereumAddress(address)) {
    return address
  }

  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, chainPropListOf(prefix).ss58Format)
}
