import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction as createNewInteraction,
} from '@kodadot1/minimark/v2'
import type { ApiPromise } from '@polkadot/api'
import type { PalletNftsDestroyWitness } from '@polkadot/types/lookup'
import type { SubmittableExtrinsicFunction } from '@polkadot/api-base/types'
import type {
  ActionDeleteCollection,
  ExecuteSubstrateTransactionParams,
  ActionConsume,
  ExecuteTransaction,
  Abi,
} from '@/composables/transaction/types'
import { warningMessage } from '@/utils/notification'
import { isLegacy } from '@/components/unique/utils'
import {
  assetHubParamResolver,
  destructTokenId,
  getApiCall,
} from '@/utils/gallery/abstractCalls'

function execBurnEvm(item: ActionConsume, executeTransaction: ExecuteTransaction) {
  const { collectionId, nftSn } = destructTokenId(item.nftIds[0])

  executeTransaction({
    address: collectionId,
    abi: item.abi as Abi,
    functionName: 'burn',
    arg: [nftSn],
  })
}

function execBurnAssetHub(item: ActionConsume, api: ApiPromise, executeTransaction: ExecuteTransaction) {
  const getApiCallParams = (nftId: string) => {
    const legacy = isLegacy(nftId)
    const paramResolver = assetHubParamResolver(legacy)

    const apiCall = getApiCall(api, item.urlPrefix, Interaction.CONSUME)
    const params = paramResolver(nftId, Interaction.CONSUME, '')

    return { apiCall, params }
  }

  let cb: SubmittableExtrinsicFunction<'promise'>, arg

  if (item.nftIds.length > 1) {
    cb = api.tx.utility.batch
    arg = [
      item.nftIds.map((nftId) => {
        const { apiCall, params } = getApiCallParams(nftId)
        return apiCall(...params)
      }),
    ]
  }
  else {
    ({ apiCall: cb, params: arg } = getApiCallParams(item.nftIds[0]))
  }

  executeTransaction({
    cb,
    arg,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execBurn(item: ActionConsume, api, executeTransaction) {
  if (isEvm(item.urlPrefix)) {
    return execBurnEvm(item, executeTransaction)
  }

  if (isAssetHub(item.urlPrefix)) {
    return execBurnAssetHub(item, api, executeTransaction)
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
  }: ExecuteSubstrateTransactionParams) => void,
) {
  const collectionId = params.collectionId.toString()

  try {
    if (params.urlPrefix === 'rmrk') {
      executeTransaction({
        cb: api.tx.system.remark,
        arg: [createInteraction(Interaction.CONSUME, collectionId, '')],
      })
    }

    if (params.urlPrefix === 'ksm') {
      executeTransaction({
        cb: api.tx.system.remark,
        arg: [
          createNewInteraction({
            action: NewInteraction.DESTROY,
            payload: { id: collectionId },
          }),
        ],
      })
    }

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
  }
  catch (error) {
    warningMessage(error)
  }
}
