import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import { warningMessage } from '@/utils/notification'

import type { ActionList, TokenToList } from './types'

function isListTxValid(item: TokenToList) {
  const meta = Number(item.price)

  if (Math.sign(meta) === -1) {
    warningMessage('Price is not valid')
    return false
  }

  return true
}

const createKusamaInteraction = (item: ActionList) => {
  const isSingle = !Array.isArray(item.token)

  const createSingleInteraction = (token: TokenToList, urlPrefix) => {
    if (!isListTxValid(token)) {
      return
    }
    const interaction =
      urlPrefix === 'rmrk'
        ? createInteraction(Interaction.LIST, token.nftId, token.price)
        : createNewInteraction({
            action: NewInteraction.LIST,
            payload: { id: token.nftId, price: token.price },
          })

    return interaction
  }

  if (isSingle) {
    return createSingleInteraction(item.token as TokenToList, item.urlPrefix)
  }
  return (item.token as TokenToList[])
    .map((token) => createSingleInteraction(token, item.urlPrefix))
    .filter((interaction): interaction is string => interaction !== undefined)
}

export function execListTx(item: ActionList, api, executeTransaction) {
  const isSingle = !Array.isArray(item.token)

  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    const interaction = createKusamaInteraction(item)
    if (!interaction) {
      return
    }
    const args = isSingle
      ? interaction
      : (interaction as string[]).map((interaction) =>
          api.tx.system.remark(interaction)
        )
    const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll
    executeTransaction({
      cb,
      arg: [args],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    if (isSingle) {
      const token = item.token as TokenToList
      executeTransaction({
        cb: getApiCall(api, item.urlPrefix, Interaction.LIST),
        arg: bsxParamResolver(token.nftId, Interaction.LIST, token.price),
        successMessage: item.successMessage,
        errorMessage: item.errorMessage,
      })
    } else {
      const tokens = item.token as TokenToList[]
      const cb = getApiCall(api, item.urlPrefix, Interaction.LIST)
      const args = tokens.map((token) =>
        cb(...bsxParamResolver(token.nftId, Interaction.LIST, token.price))
      )
      executeTransaction({
        cb: api.tx.utility.batchAll,
        arg: [args],
        successMessage: item.successMessage,
        errorMessage: item.errorMessage,
      })
    }
  }
}
