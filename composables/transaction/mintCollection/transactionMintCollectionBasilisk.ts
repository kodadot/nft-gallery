import type { ActionMintCollection } from '../types'
import { ExecuteTransactionParams } from '@/composables/useTransaction'
import { constructMeta } from './constructMeta'
import { useNewCollectionId } from './useNewCollectionId'
import { createArgs } from './utils'

export async function execMintCollectionBasilisk(
  item: ActionMintCollection,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const metadata = await constructMeta(item)

  const cb = api.tx.nft.createCollection

  const { newCollectionId } = useNewCollectionId()

  watch(newCollectionId, (id) => {
    if (id) {
      const arg = createArgs(id, metadata)
      executeTransaction({
        cb,
        arg,
        successMessage: (blockNumber) =>
          `Saved ${item.name} Collection Saved in block ${blockNumber}`,
        errorMessage: item.errorMessage,
      })
    }
  })
}
