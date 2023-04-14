import { Attribute } from '@kodadot1/minimark/common'
import { Interaction } from '@kodadot1/minimark/v1'
import { ShoppingActions } from '@/utils/shoppingActions'
import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import { Royalty } from '@/utils/royalty'

export type BaseCollectionType = {
  name: string
  file: File | null
  description: string
}

export type MintedCollectionKusama = BaseMintedCollection & {
  max: number
  symbol: string
}
export type MintedCollectionBasilisk = BaseMintedCollection & {
  lastIndexUsed: number
}
export interface TokenToMint
  extends BaseTokenType<MintedCollectionBasilisk | MintedCollectionKusama> {
  tags: Attribute[]
  nsfw: boolean
  postfix: boolean
  price?: string
  royalty?: Royalty
  hasRoyalty?: boolean
}

export interface CollectionToMintKusama extends BaseCollectionType {
  nftCount: number
  symbol: string
}
export interface CollectionToMintBasilisk extends BaseCollectionType {
  tags: Attribute[]
}

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

export interface ActionMintToken {
  interaction: Interaction.MINTNFT
  urlPrefix: string
  token: TokenToMint
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
}

export interface ActionMintCollection {
  interaction: Interaction.MINT
  urlPrefix: string
  collection: CollectionToMintBasilisk | CollectionToMintKusama
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
}

export type Actions =
  | ActionBuy
  | ActionList
  | ActionSend
  | ActionOffer
  | ActionConsume
  | ActionWithdrawOffer
  | ActionMintToken
  | ActionMintCollection
