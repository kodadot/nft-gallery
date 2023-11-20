import { BaseMintedCollection } from '@/components/base/types'
import type { ActionMintToken, MintedCollection } from '../types'
import { TokenToMint } from '../types'
import { constructMeta } from './constructMeta'
import { calculateFees, expandCopies, transactionFactory } from './utils'
import { canSupport } from '@/utils/support'

type id = { id: number }

export const assignIds = <T extends TokenToMint>(
  tokens: T[],
  lastTokenId: number,
): (T & id)[] => {
  let lastId = lastTokenId || 0

  return tokens.map((token) => {
    const { lastIndexUsed } = token.selectedCollection as MintedCollection

    lastId = Math.max(lastIndexUsed, lastId)

    return {
      ...token,
      id: ++lastId,
    }
  })
}

export const prepareTokenMintArgs = async (token: TokenToMint & id, api) => {
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

export const prepTokens = async (item: ActionMintToken, api) => {
  const tokens = Array.isArray(item.token) ? item.token : [item.token]

  const lastTokenId = await getNextTokenIdOnChain(
    api,
    (tokens[0].selectedCollection as MintedCollection).id,
  )
  const expandedTokens = expandCopies(tokens)

  const tokensWithIds = assignIds(expandedTokens, lastTokenId)
  return tokensWithIds
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

const getNextTokenIdOnChain = async (api, collectionId) => {
  return await api.query.nfts
    .collection(collectionId)
    .then((res) => Number(res.toHuman().items) || 0)
}

const getArgs = async (item: ActionMintToken, api) => {
  const tokens = await prepTokens(item, api)
  const arg = await Promise.all(
    tokens.map((token) => prepareTokenMintArgs(token, api)),
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

export const execMintStatemine = transactionFactory(getArgs)
