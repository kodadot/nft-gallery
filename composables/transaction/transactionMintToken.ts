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

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    return execMintBasilisk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }
  if (item.urlPrefix === 'stmn' || item.urlPrefix === 'stt') {
    return execMintStatemine({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
    })
  }
}
