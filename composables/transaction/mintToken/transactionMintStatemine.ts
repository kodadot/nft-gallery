import { BaseMintedCollection } from '@/components/base/types'
import type {
  ActionMintToken,
  MintTokenParams,
  MintedCollection,
} from '../types'
import { TokenToMint } from '../types'
import { constructMeta } from './constructMeta'
import { calculateFees, copiesToMint } from './utils'
import { canSupport } from '@/utils/support'

type id = { id: number }

export const assignIds = <T extends TokenToMint>(tokens: T[]): (T & id)[] => {
  let lastId = 0
  return tokens.map((token) => {
    const { alreadyMinted, lastIndexUsed } =
      token.selectedCollection as MintedCollection

    // Use the maximum value between lastId and alreadyMinted or lastIndexUsed
    lastId = Math.max(lastIndexUsed, alreadyMinted, lastId)

    return {
      ...token,
      id: ++lastId,
    }
  })
}

export const expandCopies = <T extends TokenToMint>(tokens: T[]): T[] => {
  return tokens.flatMap((token) => {
    const copies = copiesToMint(token)
    if (copies === 1) {
      return token
    }

    return Array(copies)
      .fill(null)
      .map((_, index) => {
        return {
          ...token,
          name: token.postfix ? `${token.name} #${index + 1}` : token.name,
        }
      })
  })
}

export const prepareTokenMintArgs = async (token: TokenToMint & id, api) => {
  const { id: collectionId } = token.selectedCollection as BaseMintedCollection
  const { price, id: nextId } = token

  const { accountId } = useAuth()
  const { $consola } = useNuxtApp()

  const metadata = await constructMeta(token).catch((e) => {
    $consola.error(
      'Error while constructing metadata for token:\n',
      token,
      '\n',
      e
    )
  })

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
  api
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
    tokens.map((token) => prepareTokenMintArgs(token, api))
  )
  const { enabledFees, feeMultiplier } = calculateFees()
  const supportInteraction = await getSupportInteraction(
    item,
    enabledFees,
    feeMultiplier,
    api
  )

  return [[...arg.flat(), ...supportInteraction]]
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
