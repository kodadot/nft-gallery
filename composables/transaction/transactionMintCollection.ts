import { MintCollectionParams } from './types'
import { execMintCollectionRmrk } from './mintCollection/transactionMintCollectionRmrk'
import { execMintCollectionStatemine } from './mintCollection/transactionMintCollectionStatemine'

export function execMintCollection({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintCollectionParams) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return execMintCollectionRmrk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }

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
