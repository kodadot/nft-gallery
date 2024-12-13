import type { Attribute, Metadata } from '@kodadot1/minimark/common'
import type { Interaction } from '@kodadot1/minimark/v1'
import type { ApiPromise } from '@polkadot/api'
import type { Prefix } from '@kodadot1/static'
import type { Ref } from 'vue'
import type { Abi as ViemAbi } from 'viem'
import type { BaseTokenType } from '@/components/base/types'
import type { Royalty } from '@/utils/royalty'
import type { ShoppingActions } from '@/utils/shoppingActions'
import type { Extrinsic } from '@/utils/transactionExecutor'

type SuccessFunctionMessage = (blockNumber: string) => string
export type ObjectMessage = {
  message: string | SuccessFunctionMessage
  large: boolean
  shareLink?: string
}
export type ExecuteTransactionSuccessMessage =
  | string
  | SuccessFunctionMessage
  | ObjectMessage

type BaseExecuteTransactionParams = {
  arg: any[]
  successMessage?: ExecuteTransactionSuccessMessage
  errorMessage?: string | (() => string)
}

export type ExecuteSubstrateTransactionParams = {
  cb: (...params: any[]) => Extrinsic
} & BaseExecuteTransactionParams

export type Abi = ViemAbi

export type ExecuteEvmTransactionParams = {
  address: string
  functionName: string
  abi: Abi
  value?: string
} & BaseExecuteTransactionParams

export type ExecuteTransactionParams =
  | ExecuteSubstrateTransactionParams
  | ExecuteEvmTransactionParams

export type ExecuteTransaction = (p: ExecuteTransactionParams) => void

type BaseUnionMintParams<T> = {
  item: T
  isLoading: Ref<boolean>
  status: Ref<string>
  executeTransaction: ExecuteTransaction
}

export type BaseSubstrateMintParams<T> = {
  api: ApiPromise
} & BaseUnionMintParams<T>

export type BaseEvmMintParams<T> = BaseUnionMintParams<T>

export type BaseMintParams<T> =
  | BaseSubstrateMintParams<T>
  | BaseEvmMintParams<T>

export type MintTokenParams = BaseMintParams<ActionMintToken>
export type SubstrateMintTokenParams = BaseSubstrateMintParams<ActionMintToken>

export type MintCollectionParams = BaseMintParams<ActionMintCollection>

export type MintDropParams = BaseMintParams<ActionMintDrop>
export type SubstrateMintDropParams = BaseSubstrateMintParams<ActionMintDrop>
export type EvmMintDropParams = BaseEvmMintParams<ActionMintDrop>

export type CreateSwapParams = BaseSubstrateMintParams<ActionSwap>

export type NftCountType = {
  nftCount: number
}

export type SymbolType = {
  symbol: string
}

export type BaseCollectionType = {
  name: string
  file: File | null
  description: string
  royalty?: Royalty
  hasRoyalty?: boolean
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
  max: number
}

export type TokenToMint = BaseTokenType<MintedCollection> & {
  tags: Attribute[]
  nsfw: boolean
  postfix: boolean
  price?: string | number
  royalty?: Royalty
  hasRoyalty?: boolean
}

export type ActionConsume = {
  interaction: Interaction.CONSUME
  urlPrefix: Prefix
  nftIds: string[]
  abi?: Abi | null
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
  successMessage?: string
  errorMessage?: string
}

export type TokenToList = {
  price: string
  nftId: string
}

export type TokenToOffer = {
  price: string
  collectionId: string
  nftSn: string
  duration: number
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

type TokenToSend = {
  id: string
  sn: string
  collectionId: string
}

export type ActionSend = {
  interaction: Interaction.SEND
  urlPrefix: string
  address: string
  nfts: TokenToSend[]
  abi?: Abi | null
  successMessage?: string
  errorMessage?: string
}

export type ActionOffer = {
  interaction: typeof ShoppingActions.MAKE_OFFER
  urlPrefix: string
  token: TokenToOffer | TokenToOffer[]
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
}

export type SwapSurchargeDirection = 'Send' | 'Receive'

export type SwapSurcharge = { amount: string, direction: SwapSurchargeDirection }

export type TokenToSwap = {
  id: string
  collectionId: string
  sn: string
}

export type ActionSwap = {
  interaction: typeof ShoppingActions.CREATE_SWAP
  urlPrefix: string
  offered: TokenToSwap[]
  desired: TokenToSwap[]
  surcharge?: SwapSurcharge
  duration: number
  successMessage?: string
  errorMessage?: string
}

export type ActionWithdrawOffer = {
  interaction: typeof ShoppingActions.WITHDRAW_OFFER
  urlPrefix: Prefix
  offeredId: string
  successMessage?: string
  errorMessage?: string
}

export type ActionAcceptOffer = {
  interaction: typeof ShoppingActions.ACCEPT_OFFER
  urlPrefix: Prefix
  sendCollection: string
  sendItem?: string
  receiveItem: string
  price: string
  successMessage?: string
  errorMessage?: string
}

export type ActionWithdrawSwap = {
  interaction: typeof ShoppingActions.WITHDRAW_SWAP
  urlPrefix: Prefix
  offeredId: string
  offeredCollectionId: string
  successMessage?: string
  errorMessage?: string
}

export type ActionAcceptSwap = {
  interaction: typeof ShoppingActions.ACCEPT_SWAP
  urlPrefix: Prefix
  sendCollection: string
  sendItem?: string
  receiveItem: string
  receiveCollection: string
  price: string | null
  surcharge: string | null
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

export interface ActionMintDrop {
  interaction: NFTs.MINT_DROP
  availableSerialNumbers?: string[]
  price: string | null
  collectionId: string
  prefix: Prefix
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
  UPDATE_COLLECTION = 'updateCollection',
}

export type ActionsInteractions = Interaction | ShoppingActions | Collections

export interface ActionDeleteCollection {
  interaction: Collections.DELETE
  collectionId: string
  urlPrefix: string
  successMessage?: string | ((blockNumber: string) => string)
  errorMessage?: string
}

export enum NFTs {
  MINT_DROP = 'mintDrop',
  SET_METADATA = 'setMetadata',
}

export type ActionMetadataSetMetadata = Metadata & { image: File | string }

export interface ActionSetNftMetadata {
  interaction: NFTs.SET_METADATA
  urlPrefix: string
  nftSn: string
  collectionId: string
  metadata: ActionMetadataSetMetadata
  successMessage?: string
  errorMessage?: string
}

export type SetNftMetadataParams = BaseUnionMintParams<ActionSetNftMetadata> & { api: ApiPromise }

export type UpdateCollection = {
  name: string
  description: string
  image: File | string
  imageType?: string
  banner?: File | string | null
  max: number | null
}

export type UpdateCollectionParams = BaseUnionMintParams<ActionUpdateCollection> & { api: ApiPromise }

export interface ActionUpdateCollection {
  interaction: Collections.UPDATE_COLLECTION
  collectionId: string
  collection: UpdateCollection
  update: { max: boolean, metadata: boolean }
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
  | ActionWithdrawSwap
  | ActionAcceptSwap
  | ActionWithdrawOffer
  | ActionAcceptOffer
  | ActionMintToken
  | ActionMintCollection
  | ActionDeleteCollection
  | ActionUpdateCollection
  | ActionSetNftMetadata
  | ActionMintDrop
  | ActionSwap
