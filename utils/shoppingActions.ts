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

enum BasilicActions {}

export type ShoppingActions = Interaction | OffChainActions
export const ShoppingActions = {
  ...Interaction,
  ...OffChainActions,
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
]

export const listActions: [Interaction] = [ShoppingActions.LIST]
export const buyActions: [Interaction] = [ShoppingActions.BUY]

export const getActions = (isOwner: boolean, isAvailableToBuy: boolean) => {
  return getActionList('rmrk', isOwner, isAvailableToBuy)
}

export const getMarketplaceActions = (prefix: string, isOwner: boolean, hasPrice: boolean): [Interaction] | [] => {
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


export const getActionList = (prefix: string, isOwner: boolean, hasPrice: boolean): ShoppingActions[] => {
  const baseActions = isOwner ? ownerActions : []
  baseActions.push(...getMarketplaceActions(prefix, isOwner, hasPrice))
  baseActions.push(...getChainSpecificActions(prefix, isOwner, hasPrice))
  return baseActions
}

export const getChainSpecificActions = (prefix: string, isOwner: boolean, hasPrice: boolean) => {
  // TODO: add chain specific actions
  return []
}


export const actionComponent: Record<string, string> = {
  SEND: 'AddressInput',
  DELEGATE: 'AddressInput',
  LIST: 'BalanceInput',
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
}


export const getActionButtonColor = (action: ShoppingActions): string => {
  const [color] = iconResolver[action]
  return color
}

export const getActionButtonIcon = (action: ShoppingActions): string | undefined => {
  const [, icon] = iconResolver[action]
  return icon
}

export const getActionComponent = (action: ShoppingActions): string | undefined => {
  return actionComponent[action]
}
