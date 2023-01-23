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
    const [collectionId, tokenId] = bsxParamResolver(
      item.nftId,
      Interaction.CONSUME,
      '🔥'
    )
    const hasOffers = ref(false)
    const { data } = useGraphql({
      queryName: 'offerListByNftId',
      queryPrefix: 'chain-bsx',
      variables: {
        id: item.nftId,
      },
    })

    watch(data, (data) => {
      hasOffers.value = Boolean(data.offers.length)
      const offerWithdrawArgs = data.offers.map((offer: { caller: string }) => {
        return api.tx.marketplace.withdrawOffer(
          collectionId,
          tokenId,
          offer.caller
        )
      })
      const cb = hasOffers.value
        ? api.tx.utility.batchAll
        : getApiCall(api, item.urlPrefix, Interaction.CONSUME)

      console.log([offerWithdrawArgs])
      const arg = [
        [...offerWithdrawArgs, api.tx.nft.burn(collectionId, tokenId)],
      ]

      executeTransaction({
        cb: cb,
        arg: arg,
        successMessage: item.successMessage,
        errorMessage: item.errorMessage,
      })
    })
  }
}
