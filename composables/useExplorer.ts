import { blockExplorerOf, chainPropListOf } from '@/utils/config/chain.config'
import { type Prefix } from '@kodadot1/static'

export default function () {
  const getSubstrateExplorerUrl = (
    urlPrefix: string,
    hash: string,
    prefix: Prefix,
  ): string => `${blockExplorerOf(prefix)}${urlPrefix}/${hash}`

  const getEvmExplorerUrl = (hash: string, prefix: Prefix): string =>
    `${blockExplorerOf(prefix)}/tx/${hash}`

  const getAccountUrl = (hash: string, prefix: Prefix): string =>
    getSubstrateExplorerUrl('account', hash, prefix)

  const getTransactionUrl = (hash: string, prefix: Prefix) => {
    return execByVm(
      {
        EVM: () => getEvmExplorerUrl(hash, prefix),
        SUB: () => getSubstrateExplorerUrl('extrinsic', hash, prefix),
      },
      { vm: chainPropListOf(prefix).vm },
    )
  }

  const getBlockUrl = (blockId: string, prefix: Prefix) => {
    const urlPrefix = 'block'
    return getSubstrateExplorerUrl(urlPrefix, blockId, prefix)
  }

  return {
    getAccountUrl,
    getTransactionUrl,
    getBlockUrl,
  }
}
