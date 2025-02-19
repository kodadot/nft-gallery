import type { Prefix } from '@kodadot1/static'
import type { MintTokenParams, SubstrateMintTokenParams } from './types'
import { execMintStatemine } from './mintToken/transactionMintStatemine'

export function execMintToken({ item, ...params }: MintTokenParams) {
  if (isAssetHub(item.urlPrefix as Prefix)) {
    return execMintStatemine({
      item,
      ...params,
    } as SubstrateMintTokenParams)
  }
}
