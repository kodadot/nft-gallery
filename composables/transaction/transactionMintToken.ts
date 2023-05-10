import { execMintRmrk } from './mintToken/transactionMintRmrk'
import { execMintBasilisk } from './mintToken/transactionMintBasilisk'
import { MintTokenParams } from '../useTransaction'

export function execMintToken({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintTokenParams) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return execMintRmrk({ item, api, executeTransaction, isLoading, status })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    return execMintBasilisk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }
}
