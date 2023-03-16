import type { ActionMintCollection } from '../types'
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

  const metadata = await constructMeta(item)

  const mint = createCollection(
    accountId.value,
    item.symbol || '',
    item.name,
    metadata,
    item.count
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
    successMessage: (blockNumber) =>
      `Saved ${item.name} Collection Saved in block ${blockNumber}`,
    errorMessage: item.errorMessage,
  })
}
