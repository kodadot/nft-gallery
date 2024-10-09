import { Interaction } from '@kodadot1/minimark/v1'
import { checkAddress, isAddress } from '@polkadot/util-crypto'
import type { Prefix } from '@kodadot1/static'
import type { Abi, ActionSend, ExecuteTransaction } from './types'
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
  const arg = item.nfts.map((nft) => {
    const legacy = isLegacy(nft.id)
    const paramResolver = assetHubParamResolver(legacy)
    const cb = getApiCall(api, item.urlPrefix, Interaction.SEND, legacy)
    return cb(...paramResolver(nft.id, Interaction.SEND, item.address))
  })

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [arg],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

function execSendEvm(item: ActionSend, executeTransaction: ExecuteTransaction) {
  const { accountId } = useAuth()

  // TODO: add evm mass send support
  const nft = item.nfts[0]

  executeTransaction({
    address: nft.collectionId,
    abi: item.abi as Abi,
    functionName: 'safeTransferFrom',
    arg: [accountId.value, item.address, nft.sn],
  })
}

export function execSendTx(
  item: ActionSend,
  api,
  executeTransaction: ExecuteTransaction,
) {
  if (isEvm(item.urlPrefix as Prefix)) {
    return execSendEvm(item, executeTransaction)
  }

  if (!checkTsxSend(item)) {
    return
  }

  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    execSendAssetHub(item, api, executeTransaction)
  }
}
