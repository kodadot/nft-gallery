import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import {
  assetHubParamResolver,
  bsxParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'
import { warningMessage } from '@/utils/notification'

import { isLegacy } from '@/components/unique/utils'
import type { ActionList } from './types'

function isListTxValid(item: ActionList) {
  const meta = Number(item.price)

  if (Math.sign(meta) === -1) {
    warningMessage('Price is not valid')
    return false
  }

  return true
}

export function execListTx(item: ActionList, api, executeTransaction) {
  const meta = item.price
  if (!isListTxValid(item)) {
    return
  }

  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    const interaction =
      item.urlPrefix === 'rmrk'
        ? createInteraction(Interaction.LIST, item.nftId, meta)
        : createNewInteraction({
            action: NewInteraction.LIST,
            payload: { id: item.nftId, price: meta },
          })
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [interaction],
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

  if (item.urlPrefix === 'stmn' || item.urlPrefix === 'stt') {
    const legacy = isLegacy(item.nftId)
    const paramResolver = assetHubParamResolver(legacy)
    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, Interaction.LIST),
      arg: paramResolver(item.nftId, Interaction.LIST, meta),
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}
