import { execMintRmrk } from './mintToken/transactionMintRmrk'
import { MintTokenParams, SubstrateMintTokenParams } from './types'
import { execMintStatemine } from './mintToken/transactionMintStatemine'

export function execMintToken({ item, ...params }: MintTokenParams) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return execMintRmrk({
      item,
      ...params,
    } as SubstrateMintTokenParams)
  }

  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintStatemine({
      item,
      ...params,
    } as SubstrateMintTokenParams)
  }
}
