import type { ActionMintToken, MintedCollection, TokenToMint } from '../types'
import { isRoyaltyValid } from '@/utils/royalty'
import { constructMeta } from './constructMeta'
import { BaseMintedCollection } from '@/components/base/types'
import { expandCopies, transactionFactory } from './utils'

const prepareTokenMintArgs = async (
  token: TokenToMint,
  api,
  nextId: number
) => {
  const { id: collectionId } = token.selectedCollection as BaseMintedCollection
  const { price, royalty, hasRoyalty } = token
  const metadata = await constructMeta(token)

  const create = api.tx.nft.mint(collectionId, nextId, metadata)

  const list =
    Number(price) > 0
      ? [api.tx.marketplace.setPrice(collectionId, nextId, price)]
      : []

  const addRoyalty =
    royalty !== undefined && isRoyaltyValid(royalty) && hasRoyalty
      ? [
          api.tx.marketplace.addRoyalty(
            collectionId,
            nextId,
            royalty.address,
            royalty.amount * 100
          ),
        ]
      : []

  return [create, ...list, ...addRoyalty]
}

const getArgs = async (item: ActionMintToken, api) => {
  const { $consola } = useNuxtApp()

  const tokens = expandCopies(
    Array.isArray(item.token) ? item.token : [item.token]
  )
  const arg = (
    await Promise.all(
      tokens.map((token, i) => {
        const { alreadyMinted, lastIndexUsed } =
          token.selectedCollection as MintedCollection
        const nextId = Math.max(lastIndexUsed, alreadyMinted) + i + 1
        return prepareTokenMintArgs(token, api, nextId).catch((e) => {
          $consola.error('Error:', e)
        })
      })
    )
  ).flat()

  return [arg]
}

export const execMintBasilisk = transactionFactory(getArgs)
