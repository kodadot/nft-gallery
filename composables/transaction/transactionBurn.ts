import { Interaction, createInteraction } from '@kodadot1/minimark'

import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import type { ActionConsume } from './types'

export function execBurnTx(item: ActionConsume, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.CONSUME, '1.0.0', item.nftId, '')],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, Interaction.CONSUME),
      arg: bsxParamResolver(item.nftId, Interaction.CONSUME, ''),
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}
