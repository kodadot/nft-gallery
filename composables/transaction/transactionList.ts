import { Interaction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import type { ActionList, TokenToList } from './types'
import {
  assetHubParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'
import { warningMessage } from '@/utils/notification'

import { isLegacy } from '@/components/unique/utils'

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

  const createSingleInteraction = (token: TokenToList) => {
    if (!isListTxValid(token)) {
      return undefined
    }
    const interaction
      = createNewInteraction({
        action: NewInteraction.LIST,
        payload: { id: token.nftId, price: token.price },
      })

    return interaction
  }

  if (isSingle) {
    return createSingleInteraction(item.token as TokenToList)
  }
  return (item.token as TokenToList[])
    .map(token => createSingleInteraction(token))
    .filter((interaction): interaction is string => interaction !== undefined)
}

const execAhkOrAhp = (isSingle: boolean, item: ActionList, api) => {
  const getParams = (token: TokenToList) => {
    const legacy = isLegacy(token.nftId)
    const paramResolver = assetHubParamResolver(legacy)
    return { legacy, paramResolver }
  }

  if (isSingle) {
    const token = item.token as TokenToList
    const { legacy, paramResolver } = getParams(token)
    return {
      cb: getApiCall(api, item.urlPrefix, Interaction.LIST, legacy),
      arg: paramResolver(token.nftId, Interaction.LIST, token.price),
    }
  }
  else {
    const tokens = item.token as TokenToList[]
    const args = tokens.map((token) => {
      const { legacy, paramResolver } = getParams(token)
      const cb = getApiCall(api, item.urlPrefix, Interaction.LIST, legacy)
      return cb(...paramResolver(token.nftId, Interaction.LIST, token.price))
    })

    return { cb: api.tx.utility.batchAll, arg: [args] }
  }
}

export function execListTx(item: ActionList, api, executeTransaction) {
  const isSingle = !Array.isArray(item.token)

  const fnMap = {
    ahk: execAhkOrAhp,
    ahp: execAhkOrAhp,
    // ahr: execAhkOrAhp,
  }

  const { cb, arg }
    = fnMap[item.urlPrefix]?.call(null, isSingle, item, api) || {}
  if (cb && arg) {
    const { successMessage, errorMessage } = item
    executeTransaction({ cb, arg, successMessage, errorMessage })
  }
}
