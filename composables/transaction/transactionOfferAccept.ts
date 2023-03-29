import { warningMessage } from '@/utils/notification'
import { tokenIdToRoute } from '@/components/unique/utils'

import type { ActionWithdrawOffer } from './types'

export function execAcceptOfferTx(
  params: ActionWithdrawOffer,
  api,
  executeTransaction
) {
  try {
    const { id, item } = tokenIdToRoute(params.nftId)
    const args = [id, item, params.maker]
    const cb = api.tx.marketplace.acceptOffer

    executeTransaction({
      cb,
      arg: args,
    })
  } catch (error) {
    warningMessage(error)
  }
}
