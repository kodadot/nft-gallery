import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'
import {
  bsxParamResolver,
  getApiCall,
  uniqueParamResolver,
} from '@/utils/gallery/abstractCalls'

import { ss58Of } from '@/utils/config/chain.config'
import correctFormat from '@/utils/ss58Format'
import { warningMessage } from '@/utils/notification'
import { tokenIdToRoute } from '@/components/unique/utils'

import type { ActionSend } from './types'

function checkTsxSend(item: ActionSend) {
  const [, err] = checkAddress(
    item.address,
    correctFormat(ss58Of(item.urlPrefix))
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

function execSendRmrk(item: ActionSend, api, executeTransaction) {
  const interaction =
    item.urlPrefix === 'rmrk'
      ? createInteraction(Interaction.SEND, item.nftId, item.address)
      : createNewInteraction({
          action: NewInteraction.SEND,
          payload: { id: item.nftId, recipient: item.address },
        })
  executeTransaction({
    cb: api.tx.system.remark,
    arg: [interaction],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

function execSendBasilisk(item: ActionSend, api, executeTransaction) {
  const { id, item: token } = tokenIdToRoute(item.tokenId)

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [
      [
        api.tx.marketplace.setPrice(id, token, 0),
        api.tx.nft.transfer(id, token, item.address),
      ],
    ],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

// note: price is automatically set to 0
// https://github.com/paritytech/substrate/blob/e6a13b807a88d25aa1cd0d320edb9412c3692c67/frame/uniques/src/functions.rs#LL58C2-L58C51
function execSendStatemine(item: ActionSend, api, executeTransaction) {
  executeTransaction({
    cb: getApiCall(api, item.urlPrefix, Interaction.SEND),
    arg: uniqueParamResolver(item.nftId, Interaction.SEND, item.address),
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execSendTx(item: ActionSend, api, executeTransaction) {
  if (!checkTsxSend(item)) {
    return
  }

  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    execSendRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execSendBasilisk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'stmn') {
    execSendStatemine(item, api, executeTransaction)
  }
}
