import { Interaction } from '@kodadot1/minimark/v1'

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
  getApiCall,
} from '@/utils/gallery/abstractCalls'
import type { ActionBurnMultipleNFTs, ActionConsume } from './types'

export function execBurnTx(item: ActionConsume, api, executeTransaction) {
  // item.urlPrefix === 'ahr'
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

  // item.urlPrefix === 'ahr'
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
  const collectionId = params.collectionId.toString()

  try {
    // item.urlPrefix === 'ahr'
    if (params.urlPrefix === 'ahk' || params.urlPrefix === 'ahp') {
      const witness = (
        await api.query.nfts.collection(params.collectionId)
      ).toJSON() as DestroyWitness
      const witnessArg = {
        itemMetadatas: witness?.itemMetadatas,
        itemConfigs: witness?.itemConfigs,
        attributes: witness?.attributes,
      }

      executeTransaction({
        cb: api.tx.nfts.destroy,
        arg: [collectionId, witnessArg],
      })
    }
  } catch (error) {
    warningMessage(error)
  }
}
