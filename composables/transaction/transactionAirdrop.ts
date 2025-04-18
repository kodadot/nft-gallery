import { checkAddress, isAddress } from '@polkadot/util-crypto'
import type { ActionAirdrop, ExecuteTransaction } from './types'
import { Interaction } from '@/utils/shoppingActions'
import {
  assetHubParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'

import { isLegacy } from '@/components/unique/utils'
import { ss58Of } from '@/utils/config/chain.config'
import { warningMessage } from '@/utils/notification'
import correctFormat from '@/utils/ss58Format'

function checkTxsAirdrop(item: ActionAirdrop) {
  const addresses = item.addresses

  if (addresses.length !== item.nfts.length) {
    warningMessage('The number of addresses and NFTs does not match')
    return false
  }

  return addresses.every((address) => {
    const [, err] = checkAddress(
      address,
      correctFormat(ss58Of(item.urlPrefix)),
    )

    if (!isAddress(address)) {
      warningMessage('Invalid address')
      return false
    }

    if (err) {
      warningMessage(err)
      return false
    }

    return true
  })
}

function execSendAssetHub(item: ActionAirdrop, api, executeTransaction) {
  const arg = item.nfts.map((nft, index) => {
    const legacy = isLegacy(nft.id)
    const paramResolver = assetHubParamResolver(legacy)
    const cb = getApiCall(api, item.urlPrefix, Interaction.SEND, legacy)
    return cb(...paramResolver(nft.id, Interaction.SEND, item.addresses[index]))
  })

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [arg],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execAirdropTx(
  item: ActionAirdrop,
  api,
  executeTransaction: ExecuteTransaction,
) {
  if (!checkTxsAirdrop(item)) {
    return
  }

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    execSendAssetHub(item, api, executeTransaction)
  }
}
