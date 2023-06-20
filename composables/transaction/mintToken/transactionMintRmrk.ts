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
import { usePreferencesStore } from '@/stores/preferences'
import { Extrinsic, asSystemRemark } from '@kodadot1/minimark/common'
import {
  ActionMintToken,
  MintTokenParams,
  MintedCollectionKusama,
  TokenToMint,
} from '../types'
import { constructMeta } from './constructMeta'
import { isRoyaltyValid } from '@/utils/royalty'

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
      addRoyalty
    )
  }
  return onChainProperties
}

const getMintFunction = (isV2: boolean) =>
  isV2 ? createMultipleItem : createMultipleNFT

const getUpdateNameFn = (token: TokenToMint) =>
  token.postfix && token.copies > 1 ? basicUpdateFunction : undefined

const copiesToMint = (token: TokenToMint): number => {
  const { copies, selectedCollection } = token
  const { alreadyMinted, max } = selectedCollection as MintedCollectionKusama
  const maxAllowedNftsInCollection = max === 0 ? Infinity : max
  const remaining = maxAllowedNftsInCollection - alreadyMinted
  return Math.min(copies, remaining)
}

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
    updateNameFn
  )
}

const createMintInteractionObject = (
  mint: CreatedNFT[] | NewCreatedNFT[],
  onChainProperties: IProperties
) => {
  const { isV2 } = useRmrkVersion()

  if (isV2.value) {
    return mint.map((nft) =>
      createInteraction({
        action: NewInteraction.MINT,
        payload: { value: { ...nft, properties: onChainProperties } },
      })
    )
  }
  return mint.map((nft) => createMintInteraction(Interaction.MINTNFT, nft))
}

const calculateFees = () => {
  const preferences = usePreferencesStore()
  const enabledFees: boolean =
    preferences.getHasSupport || preferences.getHasCarbonOffset

  const feeMultiplier =
    Number(preferences.getHasSupport) +
    2 * Number(preferences.getHasCarbonOffset)

  return { enabledFees, feeMultiplier }
}

const processSingleTokenToMint = async (
  token: TokenToMint,
  api
): Promise<{
  arg: string | Extrinsic[]
  createdNFTs: CreatedNFT[] | NewCreatedNFT[]
}> => {
  const metadata = await constructMeta(token, { enableCarbonOffset: true })
  const onChainProperties = getOnChainProperties(token)
  const mint = createMintObject(token, metadata, getUpdateNameFn(token))
  const mintInteraction = createMintInteractionObject(mint, onChainProperties)

  const { enabledFees, feeMultiplier } = calculateFees()

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
  const { $consola } = useNuxtApp()
  const tokens = Array.isArray(item.token) ? item.token : [item.token]

  const argsAndNftsArray = (
    await Promise.all(
      tokens.map((token) => {
        return processSingleTokenToMint(token, api).catch((e) => {
          $consola.error('Error:', e)
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
