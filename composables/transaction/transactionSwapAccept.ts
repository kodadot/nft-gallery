import type { ApiPromise } from '@polkadot/api'
import type { ActionAcceptSwap } from './types'

async function execAcceptSwapAssethub(item: ActionAcceptSwap, api: ApiPromise, executeTransaction) {
  const arg = [
    Number(item.sendCollection),
    Number(item.sendItem),
    Number(item.receiveCollection),
    Number(item.receiveItem),
    item.surcharge
      ? {
          amount: Number(item.price),
          direction: item.surcharge,
        }
      : undefined,
  ]

  executeTransaction({
    cb: api.tx.nfts.claimSwap,
    arg,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execAcceptSwap(item: ActionAcceptSwap, api: ApiPromise, executeTransaction) {
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    await execAcceptSwapAssethub(item, api, executeTransaction)
  }
}
