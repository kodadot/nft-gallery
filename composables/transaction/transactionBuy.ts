import { tokenIdToRoute } from '@/components/unique/utils'
import { createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import { getApiCall } from '@/utils/gallery/abstractCalls'
import { payRoyaltyTx, somePercentFromTX } from '@/utils/support'
import { isRoyaltyValid } from '~~/utils/royalty'
import type { ActionBuy } from './types'

function execBuyRmrk(item: ActionBuy, api, executeTransaction) {
  const isOldRemark = item.urlPrefix === 'rmrk'
  const rmrk = isOldRemark
    ? createInteraction(item.interaction, item.nftId, '')
    : createNewInteraction({
        action: NewInteraction[item.interaction],
        payload: { id: item.nftId },
      })

  const arg = [
    api.tx.system.remark(rmrk),
    api.tx.balances.transfer(item.currentOwner, item.price),
    somePercentFromTX(api, item.price),
  ]

  const royalty = {
    amount: Number(item.royalty),
    address: item.recipient || '',
  }

  if (isRoyaltyValid(royalty)) {
    arg.push(payRoyaltyTx(api, item.price, royalty))
  }

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [...arg],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

function execBuyBasilisk(item: ActionBuy, api, executeTransaction) {
  const { id, item: token } = tokenIdToRoute(item.nftId)

  // TODO: implement tx fees #5130
  executeTransaction({
    cb: getApiCall(api, item.urlPrefix, item.interaction),
    arg: [id, token],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execBuyTx(item: ActionBuy, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    execBuyRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execBuyBasilisk(item, api, executeTransaction)
  }
}
