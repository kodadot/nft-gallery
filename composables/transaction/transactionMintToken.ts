import type { MintTokenParams, SubstrateMintTokenParams } from './types'
import { execMintStatemine } from './mintToken/transactionMintStatemine'

export function execMintToken({ item, ...params }: MintTokenParams) {
  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintStatemine({
      item,
      ...params,
    } as SubstrateMintTokenParams)
  }
}
