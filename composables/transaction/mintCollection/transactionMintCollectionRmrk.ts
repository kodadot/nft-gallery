import type { CollectionToMintKusama, MintCollectionParams } from '../types'
import { constructMeta } from './constructMeta'
import {
  Interaction,
  createCollection,
  createMintInteraction,
} from '@kodadot1/minimark/v1'
import {
  Interaction as NewInteraction,
  createInteraction,
} from '@kodadot1/minimark/v2'
import { asSystemRemark } from '@kodadot1/minimark/common'

export async function execMintCollectionRmrk({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintCollectionParams) {
  const { isV2 } = useRmrkVersion()
  const { accountId } = useAuth()
  const { $i18n } = useNuxtApp()

  isLoading.value = true
  status.value = 'loader.ipfs'

  const metadata = await constructMeta(item)
  const { symbol, name, nftCount } = item.collection as CollectionToMintKusama

  const mint = createCollection(
    accountId.value,
    symbol || '',
    name,
    metadata,
    nftCount,
  )
  const mintInteraction = isV2.value
    ? createInteraction({
        action: NewInteraction.CREATE,
        payload: { value: mint },
      })
    : createMintInteraction(Interaction.MINT, mint)

  const cb = api.tx.utility.batchAll
  const arg = [[asSystemRemark(api, mintInteraction)]]
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
