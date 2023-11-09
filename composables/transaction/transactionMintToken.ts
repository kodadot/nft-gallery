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
  simulate,
}: MintTokenParams) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return execMintRmrk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
      simulate,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    return execMintBasilisk({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
      simulate,
    })
  }

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintStatemine({
      item,
      api,
      executeTransaction,
      isLoading,
      status,
      simulate,
    })
  }
}
