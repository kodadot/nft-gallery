import { ExecuteTransactionParams } from '@/composables/useTransaction'
import type { ActionMintToken, MintedCollectionBasilisk } from '../types'
import { constructMeta } from './constructMeta'

export async function execMintStatemine(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { $i18n } = useNuxtApp()

  const {
    id: collectionId,
    alreadyMinted: collectionAlreadyMinted,
    lastIndexUsed,
  } = item.token.selectedCollection as MintedCollectionBasilisk
  const { price } = item.token

  const { accountId } = useAuth()

  const metadata = await constructMeta(item)

  const cb = api.tx.utility.batchAll

  const nextId = Math.max(lastIndexUsed + 1, collectionAlreadyMinted + 1)

  const create = api.tx.nfts.mint(
    collectionId,
    nextId,
    accountId.value,
    undefined
  )

  const meta = api.tx.nfts.setMetadata(collectionId, nextId, metadata)

  const list =
    Number(price) > 0 ? [api.tx.nfts.setPrice(collectionId, nextId, price)] : []

  // TODO: add royalty via setAttribute

  const args = [[create, meta, ...list]]

  executeTransaction({
    cb,
    arg: args,
    successMessage:
      item.successMessage ||
      ((blockNumber) =>
        $i18n.t('mint.mintNFTSuccess', {
          name: item.token.name,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', { name: item.token.name }),
  })
}
