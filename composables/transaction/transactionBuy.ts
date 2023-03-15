import { createInteraction } from '@kodadot1/minimark'
import { tokenIdToRoute } from '@/components/unique/utils'

import type { ActionBuy } from './types'
import { somePercentFromTX } from '@/utils/support'
import { getApiCall } from '@/utils/gallery/abstractCalls'

function execBuyRmrk(item: ActionBuy, api, executeTransaction) {
  const version = item.urlPrefix === 'rmrk' ? '1.0.0' : '2.0.0'
  const rmrk = createInteraction(item.interaction, version, item.nftId, '')

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
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'rmrk2') {
    execBuyRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execBuyBasilisk(item, api, executeTransaction)
  }
}
