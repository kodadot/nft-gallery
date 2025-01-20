import { Interaction } from '@kodadot1/minimark/v1'
import {
  createTokensToMint,
  subscribeToCollectionLengthUpdates,
} from './massMintHelpers'
import type { NFTToMint } from '@/components/massmint/types'
import { Status } from '@/components/massmint/types'
import type { MintedCollection } from '@/composables/transaction/types'
import { fetchOdaCollection } from '@/services/oda'

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
  const { apiInstance } = useApi()
  const isLoading = ref(true)

  watchEffect(async () => {
    isLoading.value = true
    collections.value = []

    if (!accountId.value) {
      isLoading.value = false
      return null
    }

    const api = await apiInstance.value
    const queryCollections = await api.query.nfts.collectionAccount.keys(accountId.value) // get owned collections
    const ids = queryCollections.map(id => id.toHuman()).map(async (data) => {
      const id = data?.[1]
      const collection = await fetchOdaCollection(urlPrefix.value, id)
      const queryCollectionItems = await api.query.nfts.item.entries(id) // get minted items
      const queryCollectionMetadata = await api.query.nfts.collectionMetadataOf(id) // get collection metadata

      return {
        id,
        alreadyMinted: parseInt(collection.claimed),
        metadata: (queryCollectionMetadata.toHuman() as { data: string })?.data,
        name: collection.metadata.name,
        lastIndexUsed: queryCollectionItems.map(([key]) => key.args[1].toNumber()).reduce((a, b) => Math.max(a, b), 0),
        totalCount: parseInt(collection.claimed),
        max: parseInt(collection.supply),
      }
    })

    collections.value = await Promise.all(ids)
    isLoading.value = false
  })

  return {
    collections,
    isLoading,
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
