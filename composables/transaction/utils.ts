import consola from 'consola'
import { type Prefix } from '@kodadot1/static'
import {
  Collections,
  NFTs,
} from '../transaction/types'
import type {
  ActionAcceptOffer,
  ActionBuy,
  ActionConsume,
  ActionDeleteCollection,
  ActionList,
  ActionMintCollection,
  ActionMintDrop,
  ActionMintToken,
  ActionOffer,
  ActionSwap,
  ActionSend,
  ActionUpdateCollection,
  ActionCancelOffer,
  ActionSetNftMetadata,
  ActionCancelSwap,
  ActionAcceptSwap,
  Actions,
} from '../transaction/types'
import { Interaction } from '@/utils/shoppingActions'
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
  const hasContent = <T>(v: T | T[]): boolean => Array.isArray(v) ? v.length > 0 : Boolean(v)
  const hasEvery = <T>(v: T[], cb: (item: T) => boolean): boolean => v.every(cb)

  const validityMap: Record<string, (action) => boolean> = {
    [Interaction.BUY]: (action: ActionBuy) => hasContent(action.nfts),
    [Interaction.LIST]: (action: ActionList) => hasContent(action.token),
    [Interaction.MINTNFT]: (action: ActionMintToken) =>
      hasContent(action.token),
    [Interaction.SEND]: (action: ActionSend) => Boolean(action.nfts.length),
    [Interaction.CONSUME]: (action: ActionConsume) => hasContent(action.nftIds),
    [ShoppingActions.MAKE_OFFER]: (action: ActionOffer) =>
      hasContent(action.tokens) && hasEvery(action.tokens, token => Boolean(Number(token.price))),
    [ShoppingActions.CANCEL_OFFER]: (action: ActionCancelOffer) =>
      Boolean(action.offeredId),
    [ShoppingActions.CANCEL_SWAP]: (action: ActionCancelSwap) =>
      Boolean(action.offeredId) && Boolean(action.offeredCollectionId),
    [ShoppingActions.ACCEPT_SWAP]: (action: ActionAcceptSwap) =>
      Boolean(action.receiveItem) && Boolean(action.receiveCollection) && Boolean(action.sendItem) && Boolean(action.sendCollection),
    [ShoppingActions.ACCEPT_OFFER]: (action: ActionAcceptOffer) =>
      Boolean(action.sendCollection && action.price && action.receiveItem),
    [Interaction.MINT]: (action: ActionMintCollection) =>
      Boolean(action.collection),
    [Collections.DELETE]: (action: ActionDeleteCollection) =>
      Boolean(action.collectionId),
    [Collections.UPDATE_COLLECTION]: (action: ActionUpdateCollection) =>
      Boolean(action.collectionId) && (action.update.metadata || action.update.max || action.update.permission),
    [NFTs.SET_METADATA]: (action: ActionSetNftMetadata) =>
      hasContent(action.nftSn),
    [NFTs.MINT_DROP]: (action: ActionMintDrop) =>
      hasContent(action.collectionId),
    [ShoppingActions.CREATE_SWAP]: (action: ActionSwap) =>
      hasContent(action.offered) && hasContent(action.desired) && action.offered.length === action.desired.length,
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
