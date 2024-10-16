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
  const collectionsEntites = ref<MintedCollection[]>()
  const { accountId } = useAuth()
  const { urlPrefix } = usePrefix()

  const { data, isPending } = useQuery({
    queryKey: ['collections-for-mint', accountId, urlPrefix],
    queryFn: async () =>
      accountId.value
        ? (await useAsyncGraphql({
            query: 'collectionForMint',
            variables: {
              account: accountId.value,
            },
          })).data.value
        : null,
  })

  watch(data, () => {
    const collectionEntities = data.value?.collectionEntities

    if (collectionEntities?.length) {
      const collections = collectionEntities
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

      collectionsEntites.value = unwrapSafe(collections)
    }
  })

  return {
    collectionsEntites,
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
