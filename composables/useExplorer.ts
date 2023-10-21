import { blockExplorerOf } from '@/utils/config/chain.config'
import { type Prefix } from '@kodadot1/static'

export default function () {
  const getExplorerUrl = (type: string, hash: string, prefix: Prefix) =>
    `${blockExplorerOf(prefix)}${type}/${hash}`

  const getAccountUrl = (hash: string, prefix: Prefix) =>
    getExplorerUrl('account', hash, prefix)

  const getExtrinsicUrl = (hash: string, prefix: Prefix) =>
    getExplorerUrl('extrinsic', hash, prefix)

  return {
    getAccountUrl,
    getExtrinsicUrl,
  }
}
