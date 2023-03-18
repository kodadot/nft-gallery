import {
  CreatedNFT,
  Interaction,
  asSystemRemark,
  createMintInteaction,
  createMultipleNFT,
} from '@kodadot1/minimark'

import { canSupport } from '@/utils/support'

import { basicUpdateFunction } from '@/components/unique/NftUtils'
import { usePreferencesStore } from '@/stores/preferences'
import { ExecuteTransactionParams } from '@/composables/useTransaction'
import { constructMeta } from './constructMeta'
import { ActionMintToken, MintedCollectionKusama } from '../types'

export async function execMintRmrk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { accountId } = useAuth()
  const { version } = useRmrkVersion()
  const preferences = usePreferencesStore()
  const { $i18n } = useNuxtApp()

  const { id: collectionId, alreadyMinted: collectionAlreadyMinted } = item
    .token.selectedCollection as MintedCollectionKusama
  const { edition, name, postfix } = item.token

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
  const createdNFTs = ref<CreatedNFT[]>(mint)

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
    successMessage:
      item.successMessage ||
      ((blockNumber) =>
        $i18n.t('mintNFTSuccess', {
          name: item.token.name,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage || $i18n.t('mint.ErrorCreateNewNft', item.token.name),
  })
  return {
    createdNFTs,
  }
}
