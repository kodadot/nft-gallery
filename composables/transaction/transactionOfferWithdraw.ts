import type { ApiPromise } from '@polkadot/api'
import type { ActionWithdrawOffer } from './types'
import { getOfferCollectionId } from './transactionOffer'

async function execWithdrawOffer(item: ActionWithdrawOffer, api: ApiPromise, executeTransaction) {
  executeTransaction({
    cb: api.tx.nfts.cancelSwap,
    arg: [getOfferCollectionId(item.urlPrefix), item.offeredId],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execWithdrawOfferTx(item: ActionWithdrawOffer, api, executeTransaction) {
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    await execWithdrawOffer(item, api, executeTransaction)
  }
}
