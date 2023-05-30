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

export function execBurnTx(item: ActionConsume, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.CONSUME, item.nftId, '')],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'ksm') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [
        createNewInteraction({
          action: NewInteraction.BURN,
          payload: { id: item.nftId },
        }),
      ],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    const [collectionId, tokenId] = bsxParamResolver(
      item.nftId,
      Interaction.CONSUME,
      ''
    )
    const hasOffers = ref(false)
    const { data } = useGraphql({
      queryName: 'acceptableOfferListByNftId',
      queryPrefix: 'chain-bsx',
      variables: {
        id: item.nftId,
      },
    })

    watch(data, () => {
      hasOffers.value = Boolean(data.value.offers.length)
      const offerWithdrawArgs = data.value.offers.map(
        (offer: { caller: string }) => {
          return api.tx.marketplace.withdrawOffer(
            collectionId,
            tokenId,
            offer.caller
          )
        }
      )
      const cb = hasOffers.value
        ? api.tx.utility.batchAll
        : getApiCall(api, item.urlPrefix, Interaction.CONSUME)
      const arg = hasOffers.value
        ? [[...offerWithdrawArgs, api.tx.nft.burn(collectionId, tokenId)]]
        : bsxParamResolver(item.nftId, Interaction.CONSUME, '')

      executeTransaction({
        cb,
        arg,
        successMessage: item.successMessage,
        errorMessage: item.errorMessage,
      })
    })
  }

  if (item.urlPrefix === 'stmn' || item.urlPrefix === 'stt') {
    const legacy = isLegacy(item.nftId)
    const paramResolver = assetHubParamResolver(legacy)
    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, Interaction.CONSUME),
      arg: paramResolver(item.nftId, Interaction.CONSUME, ''),
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}
