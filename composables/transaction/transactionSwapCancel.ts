import type { ApiPromise } from '@polkadot/api'
import type { ActionCancelSwap } from './types'

async function execCancelSwapAssetHub(item: ActionCancelSwap, api: ApiPromise, executeTransaction) {
  executeTransaction({
    cb: api.tx.nfts.cancelSwap,
    arg: [Number(item.offeredCollectionId), Number(item.offeredId)],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execCancelSwap(item: ActionCancelSwap, api: ApiPromise, executeTransaction) {
  if (isAssetHub(item.urlPrefix)) {
    await execCancelSwapAssetHub(item, api, executeTransaction)
  }
}
