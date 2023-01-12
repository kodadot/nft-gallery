import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { Interaction, createInteraction } from '@kodadot1/minimark'

import { ss58Of } from '@/utils/config/chain.config'
import correctFormat from '@/utils/ss58Format'
import { dangerMessage } from '@/utils/notification'
import { tokenIdToRoute } from '@/components/unique/utils'

import type { ActionSend } from './types'

function checkTsxSend(item: ActionSend) {
  const [, err] = checkAddress(
    item.address,
    correctFormat(ss58Of(item.urlPrefix))
  )

  if (!isAddress(item.address)) {
    dangerMessage('Invalid address')
    return false
  }

  if (err) {
    dangerMessage(err)
    return false
  }

  return true
}

function execSendRmrk(item: ActionSend, api, executeTransaction) {
  executeTransaction({
    cb: api.tx.system.remark,
    arg: [
      createInteraction(Interaction.SEND, '1.0.0', item.nftId, item.address),
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

export function execTsxSend(item: ActionSend, api, executeTransaction) {
  if (!checkTsxSend(item)) {
    return
  }

  if (item.urlPrefix === 'rmrk') {
    execSendRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execSendBasilisk(item, api, executeTransaction)
  }
}
