import {
  Interaction,
  asSystemRemark,
  createMintInteaction,
  createMultipleNFT,
} from '@kodadot1/minimark'

import { canSupport } from '@/utils/support'

import { basicUpdateFunction } from '@/components/unique/NftUtils'
import { usePreferencesStore } from '@/stores/preferences'
import { BaseMintedCollection } from '@/components/base/types'
import { ExecuteTransactionParams } from '@/composables/useTransaction'
import { constructMeta } from './constructMeta'
import { ActionMintToken } from '../types'

type RMRKMintedCollection = BaseMintedCollection & {
  name: string
  max: number
  symbol: string
}

export async function execMintRmrk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { accountId } = useAuth()
  const { version } = useRmrkVersion()
  const preferences = usePreferencesStore()
  const { edition, name, postfix, selectedCollection } = item
  const { id: collectionId, alreadyMinted: collectionAlreadyMinted } =
    selectedCollection as RMRKMintedCollection

  const metadata = await constructMeta(item)

  const mint = createMultipleNFT(
    edition,
    accountId.value,
    collectionId,
    name,
    metadata,
    collectionAlreadyMinted,
    postfix && edition > 1 ? basicUpdateFunction : undefined
  )

  const mintInteraction = mint.map((nft) =>
    createMintInteaction(Interaction.MINTNFT, version, nft)
  )

  const enabledFees: boolean =
    preferences.getHasSupport || preferences.getHasCarbonOffset

  const feeMultiplier =
    Number(preferences.getHasSupport) +
    2 * Number(preferences.getHasCarbonOffset)

  const isSingle = mintInteraction.length === 1 && !enabledFees

  const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll

  const args = isSingle
    ? [mintInteraction[0]]
    : [
        [
          ...mintInteraction.map((nft) => asSystemRemark(api, nft)),
          ...(await canSupport(api, enabledFees, feeMultiplier)),
        ],
      ]

  executeTransaction({
    cb,
    arg: args,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
    onSuccess: item.onSuccess(mint),
    onError: item.onError,
  })
}
