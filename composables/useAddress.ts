import { isEthereumAddress } from '@polkadot/util-crypto'
import { type Prefix } from '@kodadot1/static'

export default function (urlPrefix: ComputedRef<Prefix> = usePrefix().urlPrefix) {
  const { isEvm, isSub } = useIsChain(urlPrefix)

  const getPrefixByAddress = (address: string) => {
    if (isEthereumAddress(address)) {
      return isEvm.value ? urlPrefix.value : 'base'
    }

    return isSub.value ? urlPrefix.value : 'ahp'
  }

  return {
    getPrefixByAddress,
  }
}
