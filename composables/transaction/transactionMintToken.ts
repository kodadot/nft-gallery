import { execMintRmrk } from './mintToken/transactionMintRmrk'
import { execMintBasilisk } from './mintToken/transactionMintBasilisk'
import { MintTokenParams } from './types'
import { execMintStatemine } from './mintToken/transactionMintStatemine'

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

  if (item.urlPrefix === 'bsx') {
    return execMintBasilisk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }
  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintStatemine({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }
}
