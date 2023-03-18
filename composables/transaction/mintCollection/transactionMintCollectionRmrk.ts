import type { ActionMintCollection, CollectionToMintKusama } from '../types'
import { ExecuteTransactionParams } from '@/composables/useTransaction'
import { constructMeta } from './constructMeta'
import {
  Interaction,
  asSystemRemark,
  createCollection,
  createMintInteaction,
} from '@kodadot1/minimark'
import { canSupport } from '@/utils/support'

export async function execMintCollectionRmrk(
  item: ActionMintCollection,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { version } = useRmrkVersion()
  const { accountId } = useAuth()
  const { $i18n } = useNuxtApp()

  const metadata = await constructMeta(item)
  const { symbol, name, nftCount } = item.collection as CollectionToMintKusama

  const mint = createCollection(
    accountId.value,
    symbol || '',
    name,
    metadata,
    nftCount
  )
  const mintInteraction = createMintInteaction(Interaction.MINT, version, mint)

  const cb = api.tx.utility.batchAll
  const hasSupport = true
  const arg = [
    [
      asSystemRemark(api, mintInteraction),
      ...(await canSupport(api, hasSupport)),
    ],
  ]
  executeTransaction({
    cb,
    arg,
    successMessage:
      item.successMessage ||
      ((blockNumber) =>
        $i18n.t('mintCollectionSuccess', {
          name: item.collection.name,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', item.collection.name),
  })
}
