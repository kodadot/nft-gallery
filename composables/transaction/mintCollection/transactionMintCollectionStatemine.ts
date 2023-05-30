import { ExecuteTransactionParams } from '@/composables/useTransaction'
import type { ActionMintCollection } from '../types'
// import { constructMeta } from './constructMeta'
import { useNewCollectionId } from './useNewCollectionId'
import { createArgsForNftPallet } from './utils'

export async function execMintCollectionStatemine(
  item: ActionMintCollection,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { $i18n } = useNuxtApp()
  // const metadata = await constructMeta(item)
  const { accountId } = useAuth()

  const cb = api.tx.utility.batchAll

  const { newCollectionId } = useNewCollectionId()

  const createArgs = createArgsForNftPallet(accountId.value)
  const arg = [
    [
      api.tx.nfts.create(...createArgs),
      // api.tx.nfts.setCollectionMetadata(newCollectionId, metadata), // TODO: we do not know collectionId
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
