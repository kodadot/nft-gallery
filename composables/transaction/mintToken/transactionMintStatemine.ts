import { BaseMintedCollection } from '@/components/base/types'
import type { ActionMintToken, MintedCollection } from '../types'
import { TokenToMint } from '../types'
import { constructMeta } from './constructMeta'
import { calculateFees, expandCopies, transactionFactory } from './utils'
import { canSupport } from '@/utils/support'

type id = { id: number }

export const assignIds = <T extends TokenToMint>(tokens: T[]): (T & id)[] => {
  let lastId = 0
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
  const { Airdrop, price, id: nextId } = token

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
    Airdrop,
    undefined,
  )

  const meta = api.tx.nfts.setMetadata(collectionId, nextId, metadata)

  const list =
    Number(price) > 0
      ? [api.tx.nfts.setPrice(collectionId, nextId, price, undefined)]
      : []

  // TODO: add royalty via setAttribute

  return [create, meta, ...list]
}

export const prepTokens = (item: ActionMintToken) => {
  const tokens = Array.isArray(item.token) ? item.token : [item.token]
  const expandedTokens = expandCopies(tokens)
  const tokensWithIds = assignIds(expandedTokens)
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

const getArgs = async (item: ActionMintToken, api) => {
  const tokens = prepTokens(item)
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
