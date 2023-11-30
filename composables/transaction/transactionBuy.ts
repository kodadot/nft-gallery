import { isLegacy, tokenIdToRoute } from '@/components/unique/utils'
import { createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import { getApiCall } from '@/utils/gallery/abstractCalls'
import { payRoyaltyTx, somePercentFromTX } from '@/utils/support'
import type { ActionBuy } from './types'
import { verifyRoyalty } from './utils'

function payRoyaltyAssetHub(
  legacy,
  api,
  price,
  royalty,
  collectionId,
  tokenId,
) {
  const { isValid, normalizedRoyalty } = verifyRoyalty(royalty)

  if (!isValid) {
    return
  }

  return legacy
    ? payRoyaltyTx(api, price, normalizedRoyalty)
    : api.tx.nfts.payTips([
        {
          collection: collectionId,
          item: tokenId,
          receiver: normalizedRoyalty.address,
          amount: royaltyFee(price, normalizedRoyalty.amount),
        },
      ])
}
function execBuyRmrk(item: ActionBuy, api, executeTransaction) {
  const nfts = Array.isArray(item.nfts) ? item.nfts : [item.nfts]

  const arg = nfts
    .map(({ id: nftId, price, currentOwner, royalty }) => {
      const isOldRemark = item.urlPrefix === 'rmrk'
      const rmrk = isOldRemark
        ? createInteraction(item.interaction, nftId, '')
        : createNewInteraction({
            action: NewInteraction[item.interaction],
            payload: { id: nftId },
          })

      const arg = [
        api.tx.system.remark(rmrk),
        api.tx.balances.transfer(currentOwner, price),
        somePercentFromTX(api, price),
      ]
      const { isValid, normalizedRoyalty } = verifyRoyalty(royalty)

      if (isValid) {
        arg.push(payRoyaltyTx(api, price, normalizedRoyalty))
      }

      return arg
    })
    .flat()

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [arg],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

function execBuyBasilisk(item: ActionBuy, api, executeTransaction) {
  const nfts = Array.isArray(item.nfts) ? item.nfts : [item.nfts]

  const transactions = nfts.map(({ id: nftId }) => {
    const { id, item: token } = tokenIdToRoute(nftId)
    const cb = getApiCall(api, item.urlPrefix, item.interaction)
    const arg = [id, token]
    return cb(...arg)
  })

  // TODO: implement tx fees #5130
  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [transactions],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

function execBuyStatemine(item: ActionBuy, api, executeTransaction) {
  const nfts = Array.isArray(item.nfts) ? item.nfts : [item.nfts]
  const transactions = nfts.map(({ id: nftId, price, royalty }) => {
    const legacy = isLegacy(nftId)
    const { id: collectionId, item: tokenId } = tokenIdToRoute(nftId)
    const cb = getApiCall(api, item.urlPrefix, item.interaction, legacy)
    const arg = [collectionId, tokenId, price]

    const extrinsics = [cb(...arg), somePercentFromTX(api, price)]

    const royaltyExtrinsic = payRoyaltyAssetHub(
      legacy,
      api,
      price,
      royalty,
      collectionId,
      tokenId,
    )
    if (royaltyExtrinsic) {
      extrinsics.push(royaltyExtrinsic)
    }

    return extrinsics
  })

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [transactions.flat()],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execBuyTx(item: ActionBuy, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    execBuyRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'bsx') {
    execBuyBasilisk(item, api, executeTransaction)
  }
  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    execBuyStatemine(item, api, executeTransaction)
  }
}
