import { canSupport } from '@/utils/support'
import {
  CreatedNFT,
  Interaction,
  createMintInteraction,
  createMultipleNFT,
} from '@kodadot1/minimark/v1'
import {
  CreatedNFT as NewCreatedNFT,
  Interaction as NewInteraction,
  convertAttributesToProperties,
  createInteraction,
  createMultipleItem,
  makeRoyalty,
  mergeProperties,
} from '@kodadot1/minimark/v2'

import { basicUpdateFunction } from '@/components/unique/NftUtils'
import { ExecuteTransactionParams } from '@/composables/useTransaction'
import { usePreferencesStore } from '@/stores/preferences'
import { asSystemRemark } from '@kodadot1/minimark/common'
import { ActionMintToken, MintedCollectionKusama } from '../types'
import { constructMeta } from './constructMeta'
import { isRoyaltyValid } from '@/utils/royalty'

export async function execMintRmrk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { accountId } = useAuth()
  const preferences = usePreferencesStore()
  const { $i18n } = useNuxtApp()
  const { isV2 } = useRmrkVersion()

  const { id: collectionId, alreadyMinted: collectionAlreadyMinted } = item
    .token.selectedCollection as MintedCollectionKusama
  const { edition, name, postfix, royalty, hasRoyalty } = item.token

  const metadata = await constructMeta(item, { enableCarbonOffset: true })
  const updateNameFn = postfix && edition > 1 ? basicUpdateFunction : undefined
  const mintFunction = isV2.value ? createMultipleItem : createMultipleNFT
  let onChainProperties = convertAttributesToProperties(item.token.tags)
  const addRoyalty =
    royalty !== undefined && isRoyaltyValid(royalty) && hasRoyalty
      ? makeRoyalty({ receiver: royalty.address, percent: royalty.amount })
      : undefined

  if (addRoyalty) {
    onChainProperties = mergeProperties(
      onChainProperties,
      'royaltyInfo',
      addRoyalty
    )
  }

  const mint = mintFunction(
    edition,
    accountId.value,
    collectionId,
    name,
    metadata,
    collectionAlreadyMinted,
    updateNameFn
  )
  const createdNFTs = ref<CreatedNFT[] | NewCreatedNFT[]>(mint)

  const mintInteraction = mint.map((nft) => {
    return isV2.value
      ? createInteraction({
          action: NewInteraction.MINT,
          payload: { value: { ...nft, properties: onChainProperties } },
        })
      : createMintInteraction(Interaction.MINTNFT, nft)
  })

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
        $i18n.t('mint.mintNFTSuccess', {
          name: item.token.name,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', { name: item.token.name }),
  })
  return {
    createdNFTs,
  }
}
