export enum Interaction {
  ACCEPT = 'ACCEPT',
  BASE = 'BASE',
  EQUIP = 'EQUIP',
  EQUIPPABLE = 'EQUIPPABLE',
  LOCK = 'LOCK',
  RESADD = 'RESADD',
  SETPROPERTY = 'SETPROPERTY',
  SETPRIORITY = 'SETPRIORITY',
  THEMEADD = 'THEMEADD',
  CREATE = 'CREATE',
  MINT = 'MINT',
  MINTNFT = 'MINTNFT',
  LIST = 'LIST',
  UNLIST = 'UNLIST',
  BUY = 'BUY',
  SEND = 'SEND',
  CONSUME = 'CONSUME',
  CHANGEISSUER = 'CHANGEISSUER',
  EMOTE = 'EMOTE',
  BURN = 'BURN',
  DESTROY = 'DESTROY',
}

enum OfferActions {
  MAKE_OFFER = 'MAKE_OFFER',
  SET_ROYALTY = 'SET_ROYALTY',
  CANCEL_OFFER = 'CANCEL_OFFER',
  ACCEPT_OFFER = 'ACCEPT_OFFER',
  CREATE_SWAP = 'CREATE_SWAP',
}

enum SwapActions {
  ACCEPT_SWAP = 'ACCEPT_SWAP',
  CANCEL_SWAP = 'CANCEL_SWAP',
}

export type ShoppingActions = Interaction | OfferActions | SwapActions
export type ShoppingActionToolTips = Partial<Record<ShoppingActions, string>>
export const ShoppingActions = {
  ...Interaction,
  ...OfferActions,
  ...SwapActions,
  DOWNLOAD: 'DOWNLOAD',
}

export const KeyboardValueToActionMap = {
  b: ShoppingActions.BUY,
  s: ShoppingActions.SEND,
  c: ShoppingActions.CONSUME,
  l: ShoppingActions.LIST,
}

export const ownerActions = [
  ShoppingActions.SEND,
  ShoppingActions.CONSUME,
  ShoppingActions.LIST,
]

export const listActions: [Interaction] = [ShoppingActions.LIST]
export const buyActions: [Interaction] = [ShoppingActions.BUY]
export const makeOfferActions: [OfferActions] = [ShoppingActions.MAKE_OFFER]

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
  [ShoppingActions.MAKE_OFFER]: ['is-orange'],
}
