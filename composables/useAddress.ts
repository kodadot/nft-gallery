import { isEthereumAddress } from '@polkadot/util-crypto'

export default function () {
  const { urlPrefix } = usePrefix()
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
