import { isLegacy, tokenIdToRoute } from '@/components/unique/utils'
import { createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import { getApiCall } from '@/utils/gallery/abstractCalls'
import { payRoyaltyTx, somePercentFromTX } from '@/utils/support'
import { existentialDeposit } from '@kodadot1/static'
import { asBalanceTransferAlive } from '@kodadot1/sub-api'
import { encodeAddress } from '@polkadot/util-crypto'
import type { ActionBuy } from './types'
import { verifyRoyalty } from './utils'

const getFallbackAddress = () => {
  const { chainProperties } = useChain()
  const FALBACK_ROYALTY_RECIPIENT = KODADOT_DAO

  return encodeAddress(
    FALBACK_ROYALTY_RECIPIENT,
    chainProperties.value.ss58Format,
  )
}

async function payRoyaltyAssetHub(
  legacy,
  api,
  price,
  royalty,
  collectionId,
  tokenId,
) {
  const { isValid, normalizedRoyalty } = verifyRoyalty(royalty)

  const { urlPrefix } = usePrefix()

  if (!isValid) {
    return
  }

  const balanceOfRoyaltyReceiver = BigInt(
    await getNativeBalance({
      address: normalizedRoyalty.address,
      api,
    }),
  )

  const royaltyAmount = BigInt(royaltyFee(price, normalizedRoyalty.amount))

  const accountBalanceWithRoyalty = balanceOfRoyaltyReceiver + royaltyAmount

  const targetExistentialDeposit = BigInt(existentialDeposit[urlPrefix.value])

  const receiverAddress =
    accountBalanceWithRoyalty >= targetExistentialDeposit
      ? normalizedRoyalty.address
      : getFallbackAddress()

  return legacy
    ? payRoyaltyTx(api, price, normalizedRoyalty)
    : api.tx.nfts.payTips([
        {
          collection: collectionId,
          item: tokenId,
          receiver: receiverAddress,
          amount: royaltyAmount,
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
        asBalanceTransferAlive(api, currentOwner, price),
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

async function execBuyStatemine(item: ActionBuy, api, executeTransaction) {
  const nfts = Array.isArray(item.nfts) ? item.nfts : [item.nfts]
  const transactions = await Promise.all(
    nfts.map(async ({ id: nftId, price, royalty }) => {
      const legacy = isLegacy(nftId)
      const { id: collectionId, item: tokenId } = tokenIdToRoute(nftId)
      const cb = getApiCall(api, item.urlPrefix, item.interaction, legacy)
      const arg = [collectionId, tokenId, price]

      const extrinsics = [cb(...arg), somePercentFromTX(api, price)]

      const royaltyExtrinsic = await payRoyaltyAssetHub(
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
    }),
  )

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [transactions.flat()],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execBuyTx(item: ActionBuy, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    execBuyRmrk(item, api, executeTransaction)
  }

  // item.urlPrefix === 'ahr'
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    await execBuyStatemine(item, api, executeTransaction)
  }
}
