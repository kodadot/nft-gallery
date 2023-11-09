import { MintCollectionParams } from './types'
import { execMintCollectionBasilisk } from './mintCollection/transactionMintCollectionBasilisk'
import { execMintCollectionRmrk } from './mintCollection/transactionMintCollectionRmrk'
import { execMintCollectionStatemine } from './mintCollection/transactionMintCollectionStatemine'

export function execMintCollection({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
  simulate,
}: MintCollectionParams) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return execMintCollectionRmrk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
      simulate,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    return execMintCollectionBasilisk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
      simulate,
    })
  }
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintCollectionStatemine({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
      simulate,
    })
  }
}
