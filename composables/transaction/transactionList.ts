import { Interaction, createInteraction } from '@kodadot1/minimark'

import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import { dangerMessage } from '@/utils/notification'

import type { ActionList } from './types'

function checkTsxList(item: ActionList) {
  const meta = Number(item.price)

  if (Math.sign(meta) === -1) {
    dangerMessage('Price is not valid')
    return false
  }

  return true
}

export function execListTx(item: ActionList, api, executeTransaction) {
  const meta = item.price
  if (!checkTsxList(item)) {
    return
  }

  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.LIST, '1.0.0', item.nftId, meta)],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, Interaction.LIST),
      arg: bsxParamResolver(item.nftId, Interaction.LIST, meta),
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}
