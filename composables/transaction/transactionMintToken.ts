import { MintTokenParams } from './types'
import { execMintStatemine } from './mintToken/transactionMintStatemine'

export function execMintToken({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintTokenParams) {
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
