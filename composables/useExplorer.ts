import {
  BLOCK_EXPLORER_WITH_QUERY,
  blockExplorerOf,
} from '@/utils/config/chain.config'
import { type Prefix } from '@kodadot1/static'

export default function () {
  const getExplorerUrl = (urlPrefix: string, hash: string, prefix: Prefix) =>
    `${blockExplorerOf(prefix)}${urlPrefix}/${hash}`

  const getAccountUrl = (hash: string, prefix: Prefix) =>
    getExplorerUrl('account', hash, prefix)

  const getExtrinsicUrl = (hash: string, prefix: Prefix) =>
    getExplorerUrl('extrinsic', hash, prefix)

  const getBlockUrl = (blockId: string, prefix: Prefix) => {
    const urlPrefix = BLOCK_EXPLORER_WITH_QUERY.includes(prefix) ? '' : 'block'
    return getExplorerUrl(urlPrefix, blockId, prefix)
  }

  return {
    getAccountUrl,
    getExtrinsicUrl,
    getBlockUrl,
  }
}
