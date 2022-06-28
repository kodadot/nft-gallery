import { Interaction } from '@kodadot1/minimark'
import { hasMarketplace } from './prefix'

enum OffChainActions {
  DOWNLOAD = 'DOWNLOAD',
}

enum UniqueActions {
  DELEGATE = 'DELEGATE',
  FREEZE = 'FREEZE',
  REVOKE = 'REVOKE',
  UNFREEZE = 'UNFREEZE',
}

enum BasiliskActions {
  MAKE_OFFER = 'MAKE_OFFER',
  SET_ROYALTY = 'SET_ROYALTY',
}

export type ShoppingActions = Interaction | OffChainActions | BasiliskActions
export const ShoppingActions = {
  ...Interaction,
  ...OffChainActions,
  ...BasiliskActions,
}

export const KeyboardValueToActionMap = {
  b: ShoppingActions.BUY,
  s: ShoppingActions.SEND,
  c: ShoppingActions.CONSUME,
  l: ShoppingActions.LIST,
  d: ShoppingActions.DOWNLOAD,
}

export const ownerActions = [
  ShoppingActions.SEND,
  ShoppingActions.CONSUME,
  ShoppingActions.DOWNLOAD,
  ShoppingActions.LIST,
]

export const listActions: [Interaction] = [ShoppingActions.LIST]
export const buyActions: [Interaction] = [ShoppingActions.BUY]
export const makeOfferActions: [BasiliskActions] = [ShoppingActions.MAKE_OFFER]

export const getActions = (isOwner: boolean, isAvailableToBuy: boolean) => {
  return getActionList('rmrk', isOwner, isAvailableToBuy)
}

export const getMarketplaceActions = (
  prefix: string,
  isOwner: boolean,
  hasPrice: boolean
): [Interaction] | [] => {
  const isMarketAvailable = hasMarketplace(prefix)

  if (!isMarketAvailable) {
    return []
  }

  if (isOwner) {
    return listActions
  }

  if (hasPrice) {
    return buyActions
  }

  return []
}

export const getActionList = (
  prefix: string,
  isOwner: boolean,
  hasPrice: boolean
): ShoppingActions[] => {
  let baseActions: ShoppingActions[] = isOwner ? ownerActions : []
  baseActions = [
    ...baseActions,
    ...getMarketplaceActions(prefix, isOwner, hasPrice),
  ]
  const specific = getChainSpecificActions(prefix, isOwner, hasPrice)

  baseActions = [...baseActions, ...specific]
  return [...new Set(baseActions)]
}

export const getChainSpecificActions = (
  prefix: string,
  isOwner: boolean,
  hasPrice: boolean
) => {
  if (prefix === 'bsx') {
    return !isOwner ? makeOfferActions : []
  }

  return []
}

export const actionComponent: Record<string, string> = {
  SEND: 'AddressInput',
  DELEGATE: 'AddressInput',
  LIST: 'BalanceInput',
  MAKE_OFFER: 'BalanceInput',
}

type DescriptionTuple = [string, string] | [string]
export const iconResolver: Record<string, DescriptionTuple> = {
  DELEGATE: ['is-light'],
  FREEZE: ['is-warning is-dark'],
  REVOKE: ['is-warning is-dark'],
  [ShoppingActions.SEND]: ['is-info is-dark'],
  [ShoppingActions.CONSUME]: ['is-danger'],
  [ShoppingActions.LIST]: ['is-light'],
  [ShoppingActions.BUY]: ['is-success is-dark'],
  [ShoppingActions.DOWNLOAD]: ['is-warning'],
  [ShoppingActions.MAKE_OFFER]: ['is-orange'],
}

export const getActionButtonColor = (action: ShoppingActions): string => {
  const [color] = iconResolver[action]
  return color
}

export const getActionButtonLabel = (action: ShoppingActions, ref): string => {
  return ref.$t(`actionLabels.${action}`)
}

export const getActionButtonIcon = (
  action: ShoppingActions
): string | undefined => {
  const [, icon] = iconResolver[action]
  return icon
}

export const getActionComponent = (
  action: ShoppingActions
): string | undefined => {
  return actionComponent[action]
}
