import type { MintCollectionParams } from '../types'
import { constructMeta } from './constructMeta'
import { useNewCollectionId } from './useNewCollectionId'
import { createArgs } from './utils'

export async function execMintCollectionBasilisk({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintCollectionParams) {
  const { $i18n } = useNuxtApp()

  isLoading.value = true
  status.value = 'loader.ipfs'

  const metadata = await constructMeta(item)

  const cb = api.tx.nft.createCollection

  const { newCollectionId } = useNewCollectionId()

  watch(newCollectionId, (id) => {
    if (id) {
      const arg = createArgs(id, metadata)
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
          $i18n.t('mint.errorCreateNewNft', { name: item.collection.name }),
      })
    }
  })
}
