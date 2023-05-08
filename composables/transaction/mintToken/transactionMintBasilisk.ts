import type {
  ActionMintToken,
  MintedCollectionBasilisk,
  TokenToMint,
} from '../types'
import { isRoyaltyValid } from '@/utils/royalty'
import { constructMeta } from './constructMeta'
import { ExecuteTransactionParams } from '@/composables/useTransaction'
import { BaseMintedCollection } from '@/components/base/types'

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
  const tokens = Array.isArray(item.token) ? item.token : [item.token]

  const arg = (
    await Promise.all(
      tokens.map((token, i) => {
        const { alreadyMinted, lastIndexUsed } =
          token.selectedCollection as MintedCollectionBasilisk
        const nextId = Math.max(lastIndexUsed, alreadyMinted) + i + 1
        return prepareTokenMintArgs(token, api, nextId)
      })
    )
  ).flat()

  return [arg]
}

export async function execMintBasilisk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { $i18n } = useNuxtApp()
  const args = await getArgs(item, api)

  const nameInNotifications = Array.isArray(item.token)
    ? item.token.map((t) => t.name).join(', ')
    : item.token.name

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: args,
    successMessage:
      item.successMessage ||
      ((blockNumber) =>
        $i18n.t('mint.mintNFTSuccess', {
          name: nameInNotifications,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', { name: nameInNotifications }),
  })
}
