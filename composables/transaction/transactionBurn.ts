import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'
import type { ApiPromise } from '@polkadot/api'
import type {
  ActionDeleteCollection,
  ExecuteTransactionParams,
} from '@/composables/transaction/types'
import type { PalletNftsDestroyWitness } from '@polkadot/types/lookup'

import { warningMessage } from '@/utils/notification'

import { isLegacy } from '@/components/unique/utils'
import {
  assetHubParamResolver,
  bsxParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'
import type { ActionBurnMultipleNFTs, ActionConsume } from './types'

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
      '',
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
            offer.caller,
          )
        },
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

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
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

export function execBurnMultiple(
  item: ActionBurnMultipleNFTs,
  api: ApiPromise,
  executeTransaction: ({
    cb,
    arg: [arg],
    successMessage,
    errorMessage,
  }: ExecuteTransactionParams) => void,
) {
  const cb = api.tx.utility.batch

  if (item.urlPrefix === 'rmrk') {
    const arg = item.nftIds.map((nftId) => {
      return api.tx.system.remark(
        createInteraction(Interaction.CONSUME, nftId, ''),
      )
    })

    executeTransaction({
      cb,
      arg: [arg],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'ksm') {
    const arg = item.nftIds.map((nftId) => {
      return api.tx.system.remark(
        createNewInteraction({
          action: NewInteraction.BURN,
          payload: { id: nftId },
        }),
      )
    })

    executeTransaction({
      cb,
      arg: [arg],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    const arg = item.nftIds.map((nftId) => {
      const legacy = isLegacy(nftId)
      const paramResolver = assetHubParamResolver(legacy)
      const apiCall = getApiCall(api, item.urlPrefix, Interaction.CONSUME)
      const params = paramResolver(nftId, Interaction.CONSUME, '')

      return apiCall(...params)
    })

    executeTransaction({
      cb,
      arg: [arg],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}

type DestroyWitness = {
  itemMetadatas?: PalletNftsDestroyWitness['itemMetadatas']
  itemConfigs?: PalletNftsDestroyWitness['itemConfigs']
  attributes?: PalletNftsDestroyWitness['attributes']
}

export async function execBurnCollection(
  params: ActionDeleteCollection,
  api: ApiPromise,
  executeTransaction: ({
    cb,
    arg,
    successMessage,
    errorMessage,
  }: ExecuteTransactionParams) => void,
) {
  try {
    const cb = api.tx.nfts.destroy
    const witness = (
      await api.query.nfts.collection(params.collectionId)
    ).toJSON() as DestroyWitness
    const witnessArg = {
      itemMetadatas: witness?.itemMetadatas,
      itemConfigs: witness?.itemConfigs,
      attributes: witness?.attributes,
    }

    executeTransaction({
      cb,
      arg: [params.collectionId.toString(), witnessArg],
    })
  } catch (error) {
    warningMessage(error)
  }
}
