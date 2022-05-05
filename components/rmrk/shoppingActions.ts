import { Interaction } from '@kodadot1/minimark'

enum OffChainActions {
  DOWNLOAD = 'DOWNLOAD',
}
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
  ShoppingActions.LIST,
  ShoppingActions.DOWNLOAD,
]
export const buyActions = [ShoppingActions.BUY]

export const getActions = (isOwner: boolean, isAvailableToBuy: boolean) => {
  return isOwner ? ownerActions : isAvailableToBuy ? buyActions : []
}
