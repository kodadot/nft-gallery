import { Interaction, createInteraction } from '@kodadot1/minimark'

import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import type { ActionConsume } from './types'

export function exectConsumeTx(item: ActionConsume, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.CONSUME, '1.0.0', item.nftId, '🔥')],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    // todo: withdraw offers
    const hasOffers = false
    const cb = hasOffers
      ? api.tx.utility.batchAll
      : getApiCall(api, item.urlPrefix, Interaction.CONSUME)

    const [collectionId, tokenId] = bsxParamResolver(
      item.nftId,
      Interaction.CONSUME,
      '🔥'
    )
    const arg = [
      [
        api.tx.marketplace.withdrawOffer(collectionId, tokenId),
        api.tx.nft.burn(collectionId, tokenId),
      ],
    ]

    executeTransaction({
      cb: cb,
      arg: arg,
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}
