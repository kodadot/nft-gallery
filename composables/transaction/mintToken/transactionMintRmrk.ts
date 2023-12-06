import { canSupport } from '@/utils/support'
import {
  CreatedNFT,
  Interaction,
  createMintInteraction,
  createMultipleNFT,
} from '@kodadot1/minimark/v1'
import {
  IProperties,
  CreatedNFT as NewCreatedNFT,
  Interaction as NewInteraction,
  convertAttributesToProperties,
  createInteraction,
  createMultipleItem,
  makeRoyalty,
  mergeProperties,
} from '@kodadot1/minimark/v2'

import { basicUpdateFunction } from '@/components/unique/NftUtils'
import { Extrinsic, asSystemRemark } from '@kodadot1/minimark/common'
import {
  ActionMintToken,
  MintTokenParams,
  MintedCollectionKusama,
  TokenToMint,
} from '../types'
import { constructMeta } from './constructMeta'
import { isRoyaltyValid } from '@/utils/royalty'
import { calculateFees, copiesToMint, getNameInNotifications } from './utils'
import { constructDirectoryMeta } from './constructDirectoryMeta'
import { usePreferencesStore } from '@/stores/preferences'

const getOnChainProperties = ({ tags, royalty, hasRoyalty }: TokenToMint) => {
  let onChainProperties = convertAttributesToProperties(tags)
  const addRoyalty =
    royalty !== undefined && isRoyaltyValid(royalty) && hasRoyalty
      ? makeRoyalty({ receiver: royalty.address, percent: royalty.amount })
      : undefined

  if (addRoyalty) {
    onChainProperties = mergeProperties(
      onChainProperties,
      'royaltyInfo',
      addRoyalty,
    )
  }
  return onChainProperties
}

const getMintFunction = (isV2: boolean) =>
  isV2 ? createMultipleItem : createMultipleNFT

const getUpdateNameFn = (token: TokenToMint) =>
  token.postfix && token.copies > 1 ? basicUpdateFunction : undefined

const createMintObject = (token: TokenToMint, metadata, updateNameFn) => {
  const { isV2 } = useRmrkVersion()
  const { accountId } = useAuth()
  const { name, selectedCollection } = token
  const { alreadyMinted, id } = selectedCollection as MintedCollectionKusama

  const numOfCopies = copiesToMint(token)

  const mintFunction = getMintFunction(isV2.value)
  return mintFunction(
    numOfCopies,
    accountId.value,
    id,
    name,
    metadata,
    alreadyMinted,
    updateNameFn,
  )
}

const createMintInteractionObject = (
  mint: CreatedNFT[] | NewCreatedNFT[],
  onChainProperties: IProperties,
) => {
  const { isV2 } = useRmrkVersion()

  if (isV2.value) {
    return mint.map((nft) =>
      createInteraction({
        action: NewInteraction.MINT,
        payload: { value: { ...nft, properties: onChainProperties } },
      }),
    )
  }
  return mint.map((nft) => createMintInteraction(Interaction.MINTNFT, nft))
}

const processTokens = async (
  tokens: TokenToMint[],
  metadata: string | string[],
  api,
): Promise<
  Array<{ arg: Extrinsic[]; createdNFTs: CreatedNFT[] | NewCreatedNFT[] }>
> => {
  return tokens.map((token, index) => {
    const tokenMetadata = Array.isArray(metadata) ? metadata[index] : metadata
    const onChainProperties = getOnChainProperties(token)
    const mint = createMintObject(token, tokenMetadata, getUpdateNameFn(token))
    const mintInteraction = createMintInteractionObject(mint, onChainProperties)

    const arg = [...mintInteraction.map((nft) => asSystemRemark(api, nft))]

    return {
      arg,
      createdNFTs: mint,
    }
  })
}

const getArgs = async (item: ActionMintToken, api) => {
  const preferencesStore = usePreferencesStore()
  const enableCarbonOffset = preferencesStore.getHasCarbonOffset
  const { $consola } = useNuxtApp()

  try {
    const isMultipleTokens = Array.isArray(item.token)
    const tokens = (
      isMultipleTokens ? item.token : [item.token]
    ) as TokenToMint[]
    const metadata = isMultipleTokens
      ? await constructDirectoryMeta(tokens, {
          enableCarbonOffset,
        })
      : await constructMeta(tokens[0], { enableCarbonOffset })

    const results = await processTokens(tokens, metadata, api)

    const { enabledFees, feeMultiplier } = calculateFees()
    const totalFees = feeMultiplier * tokens.length
    const supportInteraction = await canSupport(
      api,
      enabledFees,
      totalFees,
      'KSM',
    )

    const args = results
      .map(({ arg }) => arg)
      .flat()
      .concat(supportInteraction)
    const createdNFTs = ref(
      results.map(({ createdNFTs }) => createdNFTs).flat(),
    )

    return {
      args,
      createdNFTs,
    }
  } catch (e) {
    $consola.error('Error:', e)
    throw e
  }
}

export async function execMintRmrk({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintTokenParams) {
  const { $i18n } = useNuxtApp()
  isLoading.value = true
  status.value = 'loader.ipfs'
  const { args, createdNFTs } = await getArgs(item, api)

  const nameInNotifications = getNameInNotifications(item)

  const cb = api.tx.utility.batchAll

  const arg = [args]

  executeTransaction({
    cb,
    arg,
    successMessage:
      item.successMessage ??
      ((blockNumber) =>
        $i18n.t('mint.mintNFTSuccess', {
          name: nameInNotifications,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.errorCreateNewNft', { name: nameInNotifications }),
  })
  return {
    createdNFTs,
  }
}
