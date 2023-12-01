import type { ActionMintToken, MintedCollection } from '../types'
import { TokenToMint } from '../types'
import { constructMeta } from './constructMeta'
import {
  Id,
  assignIds,
  calculateFees,
  expandCopies,
  lastIndexUsed,
  transactionFactory,
} from './utils'
import { SupportTokens, canSupport } from '@/utils/support'
import { constructDirectoryMeta } from './constructDirectoryMeta'
import { ApiPromise } from '@polkadot/api'
import { usePreferencesStore } from '@/stores/preferences'

interface BuildTokenTxsParams {
  token: TokenToMint & Id
  metadata: string
  api: ApiPromise
}

const buildTokenTxs = ({ token, metadata, api }: BuildTokenTxsParams) => {
  const { accountId } = useAuth()
  const collectionId = token.selectedCollection?.id
  const { price, id: nextId, hasRoyalty, royalty } = token
  const create = api.tx.nfts.mint(
    collectionId,
    nextId,
    accountId.value,
    undefined,
  )
  const meta = api.tx.nfts.setMetadata(collectionId, nextId, metadata)

  const list =
    Number(price) > 0
      ? [api.tx.nfts.setPrice(collectionId, nextId, price, undefined)]
      : []
  const txs = [create, meta, ...list]

  if (royalty && isRoyaltyValid(royalty) && hasRoyalty) {
    const setRoyaltyAmount = api.tx.nfts.setAttribute(
      collectionId,
      nextId,
      'ItemOwner',
      'royalty',
      royalty.amount,
    )
    const setRoyaltyRecipient = api.tx.nfts.setAttribute(
      collectionId,
      nextId,
      'ItemOwner',
      'recipient',
      royalty.address,
    )
    txs.push(setRoyaltyAmount, setRoyaltyRecipient)
  }
  return txs
}

async function handleSingleToken(item: ActionMintToken, api: ApiPromise) {
  const enableCarbonOffset = usePreferencesStore().getHasCarbonOffset

  const tokens = await expandCopiesWithsIds(item, api)
  const metadataList = await Promise.all(
    tokens.map((token) => constructMeta(token, { enableCarbonOffset })),
  )
  return tokens.map((token, index) => ({
    token,
    metadata: metadataList[index],
  }))
}

async function handleMultipleTokens(item: ActionMintToken, api: ApiPromise) {
  const enableCarbonOffset = usePreferencesStore().getHasCarbonOffset
  const tokens = item.token as TokenToMint[]
  const lastTokenId = await lastIndexUsed(
    tokens[0].selectedCollection as MintedCollection,
    api,
  )
  const tokensWithIds = assignIds(tokens, lastTokenId)
  const metadata = await constructDirectoryMeta(tokensWithIds, {
    enableCarbonOffset,
  })
  return tokensWithIds.map((token, index) => ({
    token,
    metadata: metadata[index],
  }))
}
export const expandCopiesWithsIds = async (item: ActionMintToken, api) => {
  const tokens = Array.isArray(item.token) ? item.token : [item.token]

  const lastTokenId = await lastIndexUsed(
    tokens[0].selectedCollection as MintedCollection,
    api,
  )
  const expandedTokens = expandCopies(tokens)

  return assignIds(expandedTokens, lastTokenId)
}

export const getSupportInteraction = (
  item: ActionMintToken,
  enabledFees: boolean,
  feeMultiplier: number,
  api: ApiPromise,
  tokenSymbol: SupportTokens,
) => {
  const howManyTimesToChargeSupportFees = Array.isArray(item.token)
    ? item.token.length
    : 1

  const totalFees = feeMultiplier * howManyTimesToChargeSupportFees
  return canSupport(api, enabledFees, totalFees, tokenSymbol)
}

const getArgs = async (item: ActionMintToken, api: ApiPromise) => {
  const { enabledFees, feeMultiplier, token: tokenSymbol } = calculateFees()
  const supportInteraction = await getSupportInteraction(
    item,
    enabledFees,
    feeMultiplier,
    api,
    tokenSymbol,
  )

  const tokenTxsArgs = Array.isArray(item.token)
    ? await handleMultipleTokens(item, api)
    : await handleSingleToken(item, api)

  const arg = await Promise.all(
    tokenTxsArgs.map(({ token, metadata }) =>
      buildTokenTxs({ token, metadata, api }),
    ),
  )

  return [[...arg.flat(), ...supportInteraction]]
}

export const execMintStatemine = transactionFactory(getArgs)
