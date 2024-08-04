import type { MintCollectionParams } from './types'
import { execMintCollectionStatemine } from './mintCollection/transactionMintCollectionStatemine'

export function execMintCollection({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintCollectionParams) {
  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintCollectionStatemine({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }
}
