import { Interaction } from '@kodadot1/minimark/v1'
import consola from 'consola'
import { type Prefix } from '@kodadot1/static'
import {
  Collections,
  NFTs,
} from '../transaction/types'
import type {
  ActionAcceptOffer,
  ActionBurnMultipleNFTs,
  ActionBuy,
  ActionConsume,
  ActionDeleteCollection,
  ActionList,
  ActionMintCollection,
  ActionMintDrop,
  ActionMintToken,
  ActionOffer,
  ActionSend,
  ActionUpdateCollection,
  ActionWithdrawOffer,
  ActionSetNftMetadata,
  Actions } from '../transaction/types'
import { getPercentSupportFee } from '@/utils/support'

export const verifyRoyalty = (
  royalty?: Royalty,
): { isValid: boolean, normalizedRoyalty: Royalty } => {
  const normalizedRoyalty = {
    amount: Number(royalty?.amount ?? 0),
    address: royalty?.address ?? '',
  }

  return {
    isValid: isRoyaltyValid(normalizedRoyalty),
    normalizedRoyalty,
  }
}

export function isActionValid(action: Actions): boolean {
  const hasContent = <T>(v: T | T[]): boolean =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)

  const validityMap: Record<string, (action) => boolean> = {
    [Interaction.BUY]: (action: ActionBuy) => hasContent(action.nfts),
    [Interaction.LIST]: (action: ActionList) => hasContent(action.token),
    [Interaction.MINTNFT]: (action: ActionMintToken) =>
      hasContent(action.token),
    [Interaction.SEND]: (action: ActionSend) => Boolean(action.nfts.length),
    [Interaction.CONSUME]: (action: ActionConsume) => Boolean(action.nftId),
    [ShoppingActions.MAKE_OFFER]: (action: ActionOffer) =>
      hasContent(action.token),
    [ShoppingActions.WITHDRAW_OFFER]: (action: ActionWithdrawOffer) =>
      Boolean(action.offeredId),
    [ShoppingActions.ACCEPT_OFFER]: (action: ActionAcceptOffer) =>
      Boolean(action.nftId && action.collectionId && action.price && action.offeredId),
    [Interaction.MINT]: (action: ActionMintCollection) =>
      Boolean(action.collection),
    [Collections.DELETE]: (action: ActionDeleteCollection) =>
      Boolean(action.collectionId),
    [Collections.UPDATE_COLLECTION]: (action: ActionUpdateCollection) =>
      Boolean(action.collectionId),
    [NFTs.BURN_MULTIPLE]: (action: ActionBurnMultipleNFTs) =>
      hasContent(action.nftIds),
    [NFTs.SET_METADATA]: (action: ActionSetNftMetadata) =>
      hasContent(action.nftSn),
    [NFTs.MINT_DROP]: (action: ActionMintDrop) =>
      hasContent(action.collectionId),
  }

  const checker = validityMap[action.interaction]

  if (!checker) {
    consola.error(`Interaction not found: ${action.interaction}`)
    return false
  }

  return checker(action)
}

export function useBuySupportFee(
  prefix: ComputedRef<Prefix>,
  amount: ComputedRef<string | number>,
) {
  const { isAssetHub } = useIsChain(prefix)

  const hasBuySupportFee = computed(
    () => isAssetHub.value || false,
  )

  const supportFee = computed(() =>
    hasBuySupportFee.value ? getPercentSupportFee(amount.value) : 0,
  )

  return {
    hasBuySupportFee,
    supportFee,
  }
}
