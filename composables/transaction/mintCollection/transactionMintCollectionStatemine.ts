import { ExecuteTransactionParams } from '@/composables/useTransaction'
import type { ActionMintCollection } from '../types'
import { constructMeta } from './constructMeta'
import { useNewCollectionId } from './useNewCollectionId'

export async function execMintCollectionStatemine(
  item: ActionMintCollection,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { $i18n } = useNuxtApp()
  const metadata = await constructMeta(item)
  const { accountId } = useAuth()

  const cb = api.tx.utility.batchAll

  const { newCollectionId } = useNewCollectionId()

  const arg = [
    [
      api.tx.uniques.create(newCollectionId, accountId.value),
      api.tx.uniques.setCollectionMetadata(newCollectionId, metadata, false),
    ],
  ]

  watch(newCollectionId, (id) => {
    if (id) {
      executeTransaction({
        cb,
        arg,
        successMessage:
          item.successMessage ||
          ((blockNumber) =>
            $i18n.t('mint.mintCollectionSuccess', {
              name: item.collection.name,
              block: blockNumber,
            })),
        errorMessage:
          item.errorMessage ||
          $i18n.t('mint.ErrorCreateNewNft', { name: item.collection.name }),
      })
    }
  })
}
