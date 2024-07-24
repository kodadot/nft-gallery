import { Interaction } from '@kodadot1/minimark/v1'
import { checkAddress, isAddress } from '@polkadot/util-crypto'
import type { ActionSend } from './types'
import {
  assetHubParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'

import { isLegacy } from '@/components/unique/utils'
import { ss58Of } from '@/utils/config/chain.config'
import { warningMessage } from '@/utils/notification'
import correctFormat from '@/utils/ss58Format'

function checkTsxSend(item: ActionSend) {
  const [, err] = checkAddress(
    item.address,
    correctFormat(ss58Of(item.urlPrefix)),
  )

  if (!isAddress(item.address)) {
    warningMessage('Invalid address')
    return false
  }

  if (err) {
    warningMessage(err)
    return false
  }

  return true
}

// note: price is automatically set to 0
// https://github.com/paritytech/substrate/blob/e6a13b807a88d25aa1cd0d320edb9412c3692c67/frame/uniques/src/functions.rs#LL58C2-L58C51
function execSendAssetHub(item: ActionSend, api, executeTransaction) {
  const legacy = isLegacy(item.nftId)
  const paramResolver = assetHubParamResolver(legacy)

  // getApiCall(api, item.urlPrefix, Interaction.SEND, legacy)
  executeTransaction({
    cb: getApiCall(api, item.urlPrefix, Interaction.SEND, legacy),
    arg: paramResolver(item.nftId, Interaction.SEND, item.address),
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execSendTx(item: ActionSend, api, executeTransaction) {
  if (!checkTsxSend(item)) {
    return
  }

  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    execSendAssetHub(item, api, executeTransaction)
  }
}
