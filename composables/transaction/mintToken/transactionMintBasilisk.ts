import type { ActionMintToken } from '../types'
import { BaseMintedCollection } from '@/components/base/types'
import { isRoyaltyValid } from '@/utils/royalty'
import { constructMeta } from './constructMeta'
import { ExecuteTransactionParams } from '@/composables/useTransaction'

type BSXMintedCollection = BaseMintedCollection & {
  lastIndexUsed: number
}

export async function execMintBasilisk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { selectedCollection, price, royalty, hasRoyalty } = item
  const {
    id: collectionId,
    alreadyMinted: collectionAlreadyMinted,
    lastIndexUsed,
  } = selectedCollection as BSXMintedCollection

  const metadata = await constructMeta(item)

  const cb = api.tx.utility.batchAll

  const nextId = Math.max(lastIndexUsed + 1, collectionAlreadyMinted + 1)

  const create = api.tx.nft.mint(collectionId, nextId, metadata)

  const list = price
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

  const args = [[create, ...list, ...addRoyalty]]

  executeTransaction({
    cb,
    arg: args,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}
