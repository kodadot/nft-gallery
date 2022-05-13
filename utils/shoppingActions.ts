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
