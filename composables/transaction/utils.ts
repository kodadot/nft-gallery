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
  ActionSetCollectionMaxSupply,
  ActionWithdrawOffer,
  ActionWithdrawSwap,
  ActionAcceptSwap,
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
    [ShoppingActions.WITHDRAW_SWAP]: (action: ActionWithdrawSwap) =>
      Boolean(action.offeredId) && Boolean(action.offeredCollectionId),
    [ShoppingActions.ACCEPT_SWAP]: (action: ActionAcceptSwap) =>
      Boolean(action.receiveItem) && Boolean(action.receiveCollection) && Boolean(action.sendItem) && Boolean(action.sendCollection),
    [ShoppingActions.ACCEPT_OFFER]: (action: ActionAcceptOffer) =>
      Boolean(action.nftId && action.collectionId && action.price && action.offeredId),
    [Interaction.MINT]: (action: ActionMintCollection) =>
      Boolean(action.collection),
    [Collections.DELETE]: (action: ActionDeleteCollection) =>
      Boolean(action.collectionId),
    [Collections.SET_MAX_SUPPLY]: (action: ActionSetCollectionMaxSupply) =>
      Boolean(action.collectionId),
    [NFTs.BURN_MULTIPLE]: (action: ActionBurnMultipleNFTs) =>
      hasContent(action.nftIds),
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
