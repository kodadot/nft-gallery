import { BaseMintedCollection } from '@/components/base/types'
import type {
  ActionMintToken,
  MintTokenParams,
  MintedCollection,
} from '../types'
import { TokenToMint } from '../types'
import { constructMeta } from './constructMeta'

const prepareTokenMintArgs = async (
  token: TokenToMint,
  api,
  nextId: number
) => {
  const { id: collectionId } = token.selectedCollection as BaseMintedCollection
  const { price } = token

  const { accountId } = useAuth()

  const metadata = await constructMeta(token)

  const create = api.tx.nfts.mint(
    collectionId,
    nextId,
    accountId.value,
    undefined
  )

  const meta = api.tx.nfts.setMetadata(collectionId, nextId, metadata)

  const list =
    Number(price) > 0
      ? [api.tx.nfts.setPrice(collectionId, nextId, price, undefined)]
      : []

  // TODO: add royalty via setAttribute

  return [create, meta, ...list]
}

const getArgs = async (item: ActionMintToken, api) => {
  const { $consola } = useNuxtApp()

  const tokens = Array.isArray(item.token) ? item.token : [item.token]

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

export async function execMintStatemine({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintTokenParams) {
  const { $i18n } = useNuxtApp()

  isLoading.value = true
  status.value = 'loader.ipfs'
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
      $i18n.t('mint.errorCreateNewNft', { name: nameInNotifications }),
  })
}
