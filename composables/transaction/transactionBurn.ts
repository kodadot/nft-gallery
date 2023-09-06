import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'

import { isLegacy } from '@/components/unique/utils'
import {
  assetHubParamResolver,
  bsxParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'
import type { ActionConsume } from './types'

const getTransactionOptsAhk = (item, api) => {
  const legacy = isLegacy(item.nftId)
  const paramResolver = assetHubParamResolver(legacy)

  return {
    cb: getApiCall(api, item.urlPrefix, Interaction.CONSUME),
    arg: paramResolver(item.nftId, Interaction.CONSUME, ''),
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  }
}

const getTransactionOptsRmrk = (item, api) => {
  return {
    cb: api.tx.system.remark,
    arg: [createInteraction(Interaction.CONSUME, item.nftId, '')],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  }
}

const getTransactionOptsKsm = (item, api) => {
  return {
    cb: api.tx.system.remark,
    arg: [
      createNewInteraction({
        action: NewInteraction.BURN,
        payload: { id: item.nftId },
      }),
    ],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  }
}

const getTransactionOptsSnek = (item, api, val) => {
  const hasOffers = Boolean(val.offers.length)
  const [collectionId, tokenId] = bsxParamResolver(
    item.nftId,
    Interaction.CONSUME,
    ''
  )
  const offerWithdrawArgs = val.offers.map((offer: { caller: string }) => {
    return api.tx.marketplace.withdrawOffer(collectionId, tokenId, offer.caller)
  })
  const cb = hasOffers
    ? api.tx.utility.batchAll
    : getApiCall(api, item.urlPrefix, Interaction.CONSUME)
  const arg = hasOffers
    ? [[...offerWithdrawArgs, api.tx.nft.burn(collectionId, tokenId)]]
    : bsxParamResolver(item.nftId, Interaction.CONSUME, '')

  return {
    cb,
    arg,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  }
}

const getTransactionOpts = (item, api) => {
  if (item.urlPrefix === 'rmrk') {
    return getTransactionOptsRmrk(item, api)
  }

  if (item.urlPrefix === 'ksm') {
    return getTransactionOptsKsm(item, api)
  }

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return getTransactionOptsAhk(item, api)
  }
}

export function execBurnTx(item: ActionConsume, api, executeTransaction) {
  executeTransaction(getTransactionOpts(item, api))

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    const { data } = useGraphql({
      clientName: '',
      queryName: 'acceptableOfferListByNftId',
      queryPrefix: 'chain-bsx',
      variables: {
        id: item.nftId,
      },
    })

    watch(data, (val) =>
      executeTransaction(getTransactionOptsSnek(item, api, val))
    )
  }
}
