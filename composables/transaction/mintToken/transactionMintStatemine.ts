import { BaseMintedCollection } from '@/components/base/types'
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
import { canSupport } from '@/utils/support'
import { constructDirectoryMeta } from './constructDirectoryMeta'

export const singleTokenTxs = async (token: TokenToMint & Id, api) => {
  const { id: collectionId } = token.selectedCollection as BaseMintedCollection
  const { price, id: nextId, hasRoyalty, royalty } = token

  const { accountId } = useAuth()
  const { $consola } = useNuxtApp()

  const metadata = await constructMeta(token).catch((e) => {
    $consola.error(
      'Error while constructing metadata for token:\n',
      token,
      '\n',
      e,
    )
  })

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

export const multipleTokensTxs = async (
  tokens: (TokenToMint & Id)[],
  metadata: string[],
  api,
) => {
  const { id: collectionId } = tokens[0]
    .selectedCollection as BaseMintedCollection

  const { accountId } = useAuth()

  return tokens.flatMap((token, index) => {
    const { price, id: nextId, hasRoyalty, royalty } = token
    const tokenMetadata = metadata[index]

    const create = api.tx.nfts.mint(
      collectionId,
      nextId,
      accountId.value,
      undefined,
    )

    const meta = api.tx.nfts.setMetadata(collectionId, nextId, tokenMetadata)

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
  })
}

export const expandCopiesWithsIds = async (item: ActionMintToken, api) => {
  const tokens = [item.token as TokenToMint]

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
  api,
) => {
  const howManyTimesToChargeSupportFees = Array.isArray(item.token)
    ? item.token.length
    : 1

  const totalFees = feeMultiplier * howManyTimesToChargeSupportFees
  return canSupport(api, enabledFees, totalFees)
}

const getArgs = async (item: ActionMintToken, api) => {
  const { $consola } = useNuxtApp()

  if (!Array.isArray(item.token)) {
    // single token (with possible copies)
    const tokens = await expandCopiesWithsIds(item, api)
    const arg = await Promise.all(
      tokens.map((token) => singleTokenTxs(token, api)),
    )
    const { enabledFees, feeMultiplier } = calculateFees()
    const supportInteraction = await getSupportInteraction(
      item,
      enabledFees,
      feeMultiplier,
      api,
    )

    return [[...arg.flat(), ...supportInteraction]]
  }

  // multiple tokens (mass mint)

  const lastTokenId = await lastIndexUsed(
    item.token[0].selectedCollection as MintedCollection,
    api,
  )

  const tokensWithIds = assignIds(item.token, lastTokenId)
  const metadata = await constructDirectoryMeta(tokensWithIds).catch((e) => {
    $consola.error('Error while constructing metadata for tokens:\n', e)
    throw e
  })

  const arg = await multipleTokensTxs(tokensWithIds, metadata, api)

  const { enabledFees, feeMultiplier } = calculateFees()

  const supportInteraction = await getSupportInteraction(
    item,
    enabledFees,
    feeMultiplier,
    api,
  )

  return [[...arg, ...supportInteraction]]
}

export const execMintStatemine = transactionFactory(getArgs)
