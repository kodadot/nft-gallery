import { createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'
import { tokenIdToRoute } from '@/components/unique/utils'

import type { ActionBuy } from './types'
import { somePercentFromTX } from '@/utils/support'
import { getApiCall } from '@/utils/gallery/abstractCalls'

function execBuyRmrk(item: ActionBuy, api, executeTransaction) {
  const isOldRemark = item.urlPrefix === 'rmrk'
  const rmrk = isOldRemark
    ? createInteraction(item.interaction, item.nftId, '')
    : createNewInteraction({
        action: NewInteraction[item.interaction],
        payload: { id: item.nftId },
      })

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [
      [
        api.tx.system.remark(rmrk),
        api.tx.balances.transfer(item.currentOwner, item.price),
        somePercentFromTX(api, item.price),
      ],
    ],
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
