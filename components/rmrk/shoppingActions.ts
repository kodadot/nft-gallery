import { Interaction } from '@kodadot1/minimark'

enum NewActions {
  DOWNLOAD = 'DOWNLOAD',
}
export type ShoppingActions = Interaction | NewActions
export const ShoppingActions = {
  ...Interaction,
  ...NewActions,
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
