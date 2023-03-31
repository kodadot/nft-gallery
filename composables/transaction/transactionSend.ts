import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { Interaction, createInteraction } from '@kodadot1/minimark'

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
  const version = item.urlPrefix === 'rmrk' ? '1.0.0' : '2.0.0'
  executeTransaction({
    cb: api.tx.system.remark,
    arg: [
      createInteraction(Interaction.SEND, version, item.nftId, item.address),
    ],
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

export function execSendTx(item: ActionSend, api, executeTransaction) {
  if (!checkTsxSend(item)) {
    return
  }

  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'rmrk2') {
    execSendRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execSendBasilisk(item, api, executeTransaction)
  }
}
