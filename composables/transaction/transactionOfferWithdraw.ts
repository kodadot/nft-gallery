import { warningMessage } from '@/utils/notification'
import { tokenIdToRoute } from '~~/components/unique/utils'

import type { ActionWithdrawOffer } from './types'

export function execWithdrawOfferTx(
  params: ActionWithdrawOffer,
  api,
  executeTransaction
) {
  try {
    const { id, item } = tokenIdToRoute(params.nftId)
    const args = [id, item, params.maker]
    const cb = api.tx.marketplace.withdrawOffer

    executeTransaction({
      cb,
      arg: args,
    })
  } catch (error) {
    warningMessage(error)
  }
}
