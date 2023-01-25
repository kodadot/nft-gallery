import { Interaction, createInteraction } from '@kodadot1/minimark'

import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'

import type { ActionUnlist } from './types'

export function execUnlistTx(item: ActionUnlist, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.LIST, '1.0.0', item.nftId, '0')],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, Interaction.LIST),
      arg: bsxParamResolver(item.nftId, Interaction.LIST, 0),
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}
