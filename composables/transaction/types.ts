import { Attribute, Interaction } from '@kodadot1/minimark'
import { ShoppingActions } from '@/utils/shoppingActions'
import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import { Royalty } from '@/utils/royalty'

export type ActionConsume = {
  interaction: Interaction.CONSUME
  urlPrefix: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

export type ActionBuy = {
  interaction: Interaction.BUY
  urlPrefix: string
  price: string
  nftId: string
  tokenId: string
  currentOwner: string
  successMessage?: string
  errorMessage?: string
}

export type ActionList = {
  interaction: Interaction.LIST
  urlPrefix: string
  price: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

export type ActionSend = {
  interaction: Interaction.SEND
  urlPrefix: string
  tokenId: string
  address: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

export type ActionOffer = {
  interaction: typeof ShoppingActions.MAKE_OFFER
  urlPrefix: string
  tokenId: string
  day: number
  price: number
  currentOwner: string
  successMessage?: string
  errorMessage?: string
}

export type ActionWithdrawOffer = {
  interaction: typeof ShoppingActions.WITHDRAW_OFFER
  nftId: string
  maker: string
  successMessage?: string
  errorMessage?: string
}

export type ActionAcceptOffer = {
  interaction: typeof ShoppingActions.WITHDRAW_OFFER
  nftId: string
  maker: string
  successMessage?: string
  errorMessage?: string
}

export interface ActionMintToken extends BaseTokenType<BaseMintedCollection> {
  interaction: Interaction.MINTNFT
  urlPrefix: string
  tags: Attribute[]
  nsfw: boolean
  price?: string
  postfix: boolean
  royalty?: Royalty
  edition: number
  hasRoyalty?: boolean
  successMessage?: string | string | ((blockNumber: string) => string)
  errorMessage?: string
  onError?: () => void
}

export type Actions =
  | ActionBuy
  | ActionList
  | ActionSend
  | ActionOffer
  | ActionConsume
  | ActionWithdrawOffer
  | ActionMintToken
