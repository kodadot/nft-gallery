import type {
  ActionMintCollection,
  CollectionToMintKusama,
  ExecuteTransactionParams,
} from '../types'
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
import { canSupport } from '@/utils/support'

export async function execMintCollectionRmrk(
  item: ActionMintCollection,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { isV2 } = useRmrkVersion()
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
  const mintInteraction = isV2.value
    ? createInteraction({
        action: NewInteraction.CREATE,
        payload: { value: mint },
      })
    : createMintInteraction(Interaction.MINT, mint)

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
        $i18n.t('mint.mintCollectionSuccess', {
          name: item.collection.name,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', { name: item.collection.name }),
  })
}
