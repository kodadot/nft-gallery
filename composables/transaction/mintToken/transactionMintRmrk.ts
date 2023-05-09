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
import { Extrinsic, asSystemRemark } from '@kodadot1/minimark/common'
import { ActionMintToken, TokenToMint } from '../types'
import { constructMeta } from './constructMeta'
import { isRoyaltyValid } from '@/utils/royalty'
import { BaseMintedCollection } from '@/components/base/types'
import { Ref } from 'vue'

const processSingleTokenToMint = async (
  token: TokenToMint,
  api
): Promise<{
  arg: string | Extrinsic[]
  createdNFTs: CreatedNFT[] | NewCreatedNFT[]
}> => {
  const { accountId } = useAuth()
  const preferences = usePreferencesStore()
  const { isV2 } = useRmrkVersion()

  const { id: collectionId, alreadyMinted: collectionAlreadyMinted } =
    token.selectedCollection as BaseMintedCollection
  const { edition, name, postfix, royalty, hasRoyalty } = token

  const metadata = await constructMeta(token, { enableCarbonOffset: true })
  const updateNameFn = postfix && edition > 1 ? basicUpdateFunction : undefined
  const mintFunction = isV2.value ? createMultipleItem : createMultipleNFT
  let onChainProperties = convertAttributesToProperties(token.tags)
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

  return {
    arg: isSingle
      ? mintInteraction[0]
      : [
          ...mintInteraction.map((nft) => asSystemRemark(api, nft)),
          ...(await canSupport(api, enabledFees, feeMultiplier)),
        ],
    createdNFTs: mint,
  }
}

const getArgs = async (item: ActionMintToken, api) => {
  const tokens = Array.isArray(item.token) ? item.token : [item.token]

  const argsAndNftsArray = (
    await Promise.all(
      tokens.map((token) => {
        return processSingleTokenToMint(token, api).catch((e) => {
          console.log('Error:', e)
        })
      })
    )
  ).filter(Boolean)

  const args = argsAndNftsArray.map((argsAndNfts) => argsAndNfts?.arg).flat()
  const createdNFTs = ref(
    argsAndNftsArray.map((argsAndNfts) => argsAndNfts?.createdNFTs).flat()
  )
  return {
    args,
    createdNFTs,
  }
}

export async function execMintRmrk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void,
  isLoading: Ref<boolean>,
  status: Ref<string>
) {
  const { $i18n } = useNuxtApp()
  isLoading.value = true
  status.value = 'loader.ipfs'
  const { args, createdNFTs } = await getArgs(item, api)

  const nameInNotifications = Array.isArray(item.token)
    ? item.token.map((t) => t.name).join(', ')
    : item.token.name

  const isSingle = args.length === 1
  const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll

  executeTransaction({
    cb,
    arg: [args],
    successMessage:
      item.successMessage ||
      ((blockNumber) =>
        $i18n.t('mint.mintNFTSuccess', {
          name: nameInNotifications,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', { name: nameInNotifications }),
  })
  return {
    createdNFTs,
  }
}
