import type { ApiPromise } from '@polkadot/api'
import type { ActionWithdrawSwap } from './types'

async function execWithdrawSwapAssethub(item: ActionWithdrawSwap, api: ApiPromise, executeTransaction) {
  executeTransaction({
    cb: api.tx.nfts.cancelSwap,
    arg: [Number(item.offeredCollectionId), Number(item.offeredId)],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execWithdrawSwap(item: ActionWithdrawSwap, api: ApiPromise, executeTransaction) {
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    await execWithdrawSwapAssethub(item, api, executeTransaction)
  }
}
