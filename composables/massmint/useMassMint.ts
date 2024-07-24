import { Interaction } from '@kodadot1/minimark/v1'
import {
  createTokensToMint,
  subscribeToCollectionLengthUpdates,
} from './massMintHelpers'
import { unwrapSafe } from '@/utils/uniquery'
import resolveQueryPath from '@/utils/queryPathResolver'
import type { NFTToMint } from '@/components/massmint/types'
import { Status } from '@/components/massmint/types'
import type { MintedCollection } from '@/composables/transaction/types'

export const statusTranslation = (status?: Status): string => {
  const { $i18n } = useNuxtApp()
  const statusTranslationMap: Record<Status, string> = {
    [Status.Ok]: $i18n.t('ok'),
    [Status.Incomplete]: $i18n.t('incomplete'),
    [Status.Description]: $i18n.t('description'),
    [Status.Price]: $i18n.t('price'),
    [Status.Optional]: $i18n.t('optional'),
  }
  return status ? statusTranslationMap[status] : ''
}

export const statusClass = (status?: Status) => {
  const statusMap: Record<Status, string> = {
    [Status.Ok]: 'bg-k-green-accent',
    [Status.Incomplete]: 'bg-k-red-accent',
    [Status.Description]: 'bg-k-yellow',
    [Status.Price]: 'bg-k-yellow',
    [Status.Optional]: 'bg-k-yellow',
  }

  return status ? statusMap[status] : ''
}

export const useCollectionForMint = () => {
  const collectionsEntites = ref<MintedCollection[]>()
  const collections = ref()
  const { $consola } = useNuxtApp()
  const { accountId, isLogIn } = useAuth()
  const { client, urlPrefix } = usePrefix()

  const doFetch = async () => {
    if (!isLogIn.value) {
      return
    }

    const prefix = urlPrefix.value
    const query = await resolveQueryPath(prefix, 'collectionForMint')
    const { data } = await useAsyncQuery({
      query: query.default,
      variables: {
        account: accountId.value,
      },
      clientId: client.value,
    })

    const { collectionEntities } = data.value

    collections.value = collectionEntities
      .map(collection => ({
        ...collection,
        lastIndexUsed: Math.max(
          ...collection.nfts.map(nft => Number(nft.index)),
        ),

        alreadyMinted: collection.nfts?.length,
        totalCount: collection.nfts?.filter(nft => !nft.burned).length,
      }))
      .filter(
        collection =>
          (collection.max || Infinity) - collection.alreadyMinted > 0,
      )
  }

  const doFetchWithErrorHandling = () =>
    doFetch().catch((error) => {
      $consola.error(
        `Error fetching collections for account ${accountId.value}:`,
        error,
      )
    })

  watch(accountId, doFetchWithErrorHandling, { immediate: true })

  watch(collections, () => {
    if (!collections) {
      $consola.log(`collections for account ${accountId.value} not found`)
      return
    }

    collectionsEntites.value = unwrapSafe(collections.value)
  })

  return {
    collectionsEntites,
  }
}

export const useMassMint = (
  nfts: NFTToMint[],
  collection: MintedCollection,
) => {
  const { blockNumber, transaction, isLoading, status, isError }
    = useTransaction()
  const collectionUpdated = ref(false)
  const { urlPrefix } = usePrefix()

  const tokens = createTokensToMint(nfts, collection)

  const simpleMint = () => {
    transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: urlPrefix.value,
      token: tokens,
    })

    watch(subscribeToCollectionLengthUpdates(collection.id), (isDone) => {
      collectionUpdated.value = isDone
    })
  }

  simpleMint()

  return {
    blockNumber,
    isLoading,
    status,
    collectionUpdated,
    isError,
  }
}
