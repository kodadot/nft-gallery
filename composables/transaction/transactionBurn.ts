import { Interaction, createInteraction } from '@kodadot1/minimark'

import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import type { ActionConsume } from './types'

export function execBurnTx(item: ActionConsume, api, executeTransaction) {
  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.CONSUME, '1.0.0', item.nftId, '')],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'rmrk2') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction('BURN' as any, '2.0.0', item.nftId, '')],
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
      queryName: 'offerListByNftId',
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
        ? api.tx.utility.batch
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
}
