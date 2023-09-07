import { execMintRmrk } from './mintToken/transactionMintRmrk'
import { execMintBasilisk } from './mintToken/transactionMintBasilisk'
import { MintTokenParams } from './types'
import { execMintStatemine } from './mintToken/transactionMintStatemine'

export function execMintToken(mintParams: MintTokenParams) {
  const { item } = mintParams

  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return execMintRmrk(mintParams)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    return execMintBasilisk(mintParams)
  }

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execMintStatemine(mintParams)
  }
}
