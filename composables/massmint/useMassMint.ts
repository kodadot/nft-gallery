import { Interaction } from '@kodadot1/minimark/v1'
import { useQuery } from '@tanstack/vue-query'
import {
  createTokensToMint,
  subscribeToCollectionLengthUpdates,
} from './massMintHelpers'
import { unwrapSafe } from '@/utils/uniquery'
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
  const collections = ref<MintedCollection[]>()
  const { accountId } = useAuth()
  const { urlPrefix } = usePrefix()

  const { data, isPending } = useQuery({
    queryKey: ['collections-for-mint', accountId, urlPrefix],
    queryFn: async () => {
      if (!accountId.value) {
        return null
      }

      collections.value = []

      return (await useAsyncGraphql({
        query: 'collectionForMint',
        variables: {
          account: accountId.value,
        },
      })).data.value
    },
  })

  const collectionEntities = computed(() => data.value?.collectionEntities || [])

  const { data: collectionTotalCounts } = useQuery({
    queryKey: ['collection-total-counts', computed(() => collectionEntities.value?.map(c => c.id))],
    queryFn: async () =>
      collectionEntities.value?.length
        ? await Promise.all(collectionEntities.value.map(collection => new Promise((resolve, reject) =>
          fetchGraphql(`
            nftEntitiesConnection(
              orderBy: blockNumber_ASC,
              where: {
                collection: { id_eq: "${collection.id}" }
                burned_eq: false
            }) {
                totalCount
            }
          `)
            .then(response => resolve(response.data.nftEntitiesConnection.totalCount))
            .catch(reject),
        )))
        : null,
  })

  watch([collectionEntities, collectionTotalCounts], async ([data, totalCounts]) => {
    if (data?.length && totalCounts) {
      const newCollections = data
        .map((collection, index) => ({
          ...collection,
          minted: collection.nftCount,
          totalCount: totalCounts[index],
        }))
        .filter(collection => (collection.max || Infinity) - collection.minted > 0)

      collections.value = unwrapSafe(newCollections)
    }
  }, { immediate: true })

  return {
    collections,
    isLoading: isPending,
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
