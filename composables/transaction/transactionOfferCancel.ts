import type { ApiPromise } from '@polkadot/api'
import type { ActionCancelOffer } from './types'
import { getOfferCollectionId } from './transactionOffer'

async function execCancelOfferAssetHub(item: ActionCancelOffer, api: ApiPromise, executeTransaction) {
  executeTransaction({
    cb: api.tx.nfts.cancelSwap,
    arg: [getOfferCollectionId(item.urlPrefix), Number(item.offeredId)],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execCancelOffer(item: ActionCancelOffer, api, executeTransaction) {
  if (isAssetHub(item.urlPrefix)) {
    await execCancelOfferAssetHub(item, api, executeTransaction)
  }
}
