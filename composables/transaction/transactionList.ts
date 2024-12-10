import { Interaction } from '@kodadot1/static'
import type { ActionList, TokenToList } from './types'
import {
  assetHubParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'

import { isLegacy } from '@/components/unique/utils'

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
