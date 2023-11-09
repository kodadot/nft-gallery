import { Attribute } from '@kodadot1/minimark/common'
import { Interaction } from '@kodadot1/minimark/v1'
import { ShoppingActions } from '@/utils/shoppingActions'
import { BaseTokenType } from '@/components/base/types'
import { Royalty } from '@/utils/royalty'
import { Extrinsic } from '@/utils/transactionExecutor'
import type { ApiPromise } from '@polkadot/api'
import { Ref } from 'vue'

type SuccessFunctionMessage = (blockNumber: string) => string
export type ObjectMessage = {
  message: string | SuccessFunctionMessage
  large: boolean
}
export type ExecuteTransactionSuccessMessage =
  | string
  | SuccessFunctionMessage
  | ObjectMessage

export type ExecuteTransactionParams = {
  cb: (...params: any[]) => Extrinsic
  arg: any[]
  successMessage?: ExecuteTransactionSuccessMessage
  errorMessage?: string | (() => string)
}

type SimulatableActionParams = {
  simulate?: boolean
}

type BaseMintParams<T> = {
  item: T
  api: ApiPromise
  executeTransaction: (p: ExecuteTransactionParams) => void
  isLoading: Ref<boolean>
  status: Ref<string>
} & SimulatableActionParams

export type MintTokenParams = BaseMintParams<ActionMintToken>

export type MintCollectionParams = BaseMintParams<ActionMintCollection>

export type NftCountType = {
  nftCount: number
}

export type Max = { max: number }

export type SymbolType = {
  symbol: string
}

export type BaseCollectionType = {
  name: string
  file: File | null
  description: string
}

export type CollectionToMintKusama = BaseCollectionType &
  NftCountType &
  SymbolType

export type CollectionToMintStatmine = BaseCollectionType & NftCountType

export type CollectionToMintBasilisk = BaseCollectionType & {
  tags: Attribute[]
}

export type MintedCollection = {
  id: string
  alreadyMinted: number
  metadata: string
  name?: string
  lastIndexUsed: number
  totalCount: number
}

export type MintedCollectionKusama = MintedCollection & Max & SymbolType

export type TokenToMint = BaseTokenType<
  MintedCollection | MintedCollectionKusama
> & {
  tags: Attribute[]
  nsfw: boolean
  postfix: boolean
  price?: string | number
  royalty?: Royalty
  hasRoyalty?: boolean
}

export type ActionConsume = {
  interaction: Interaction.CONSUME
  urlPrefix: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

export type TokenToBuy = {
  id: string
  price: string
  currentOwner: string
  royalty?: Royalty
}

export type ActionBuy = {
  interaction: Interaction.BUY
  urlPrefix: string
  nfts: TokenToBuy | TokenToBuy[]
  successMessage?: string | ObjectMessage
  errorMessage?: string
}

export type TokenToList = {
  price: string
  nftId: string
}

export type ActionList = {
  interaction: Interaction.LIST
  urlPrefix: string
  token: TokenToList | TokenToList[]
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
  nftId?: string
  price?: string
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
  token: TokenToMint | TokenToMint[]
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
}

export interface ActionMintCollection {
  interaction: Interaction.MINT
  urlPrefix: string
  collection:
    | CollectionToMintBasilisk
    | CollectionToMintKusama
    | CollectionToMintStatmine
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
}

export enum Collections {
  DELETE = 'delete',
}

export type ActionsInteractions = Interaction | ShoppingActions | Collections

export interface ActionDeleteCollection {
  interaction: Collections.DELETE
  collectionId: string
  urlPrefix: string
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
  | ActionDeleteCollection
