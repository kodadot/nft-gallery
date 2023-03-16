import { execMintRmrk } from './MintToken/transactionMintRmrk'
import { execMintBasilisk } from './MintToken/transactionMintBasilisk'
import { ActionMintToken } from './types'

export function execMintToken(item: ActionMintToken, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'rmrk2') {
    return execMintRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    return execMintBasilisk(item, api, executeTransaction)
  }
}
