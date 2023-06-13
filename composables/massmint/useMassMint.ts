import { unwrapSafe } from '@/utils/uniquery'
import resolveQueryPath from '@/utils/queryPathResolver'
import { NFTToMint, Status } from '../../components/massmint/types'
import { Interaction } from '@kodadot1/minimark/v1'
import { MintedCollection } from '@/composables/transaction/types'
import {
  createTokensToMint,
  kusamaMintAndList,
  subscribeToCollectionLengthUpdates,
} from './massMintHelpers'

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
    [Status.Ok]: 'k-greenaccent',
    [Status.Incomplete]: 'k-redaccent',
    [Status.Description]: 'k-yellow',
    [Status.Price]: 'k-yellow',
    [Status.Optional]: 'k-yellow',
  }

  return status ? statusMap[status] : ''
}

export const useCollectionForMint = () => {
  const collectionsEntites = ref<MintedCollection[]>()
  const collections = ref()
  const { $consola, $apollo } = useNuxtApp()
  const { accountId, isLogIn } = useAuth()
  const { urlPrefix } = usePrefix()
  const queryPath = {
    rmrk: 'chain-rmrk',
    ksm: 'chain-rmrk',
  }

  const doFetch = async () => {
    if (!isLogIn.value) {
      return
    }

    const prefix = queryPath[urlPrefix.value] || urlPrefix.value
    const query = await resolveQueryPath(prefix, 'collectionForMint')
    const data = await $apollo.query({
      query: query.default,
      client: urlPrefix.value,
      variables: {
        account: accountId.value,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { collectionEntities },
    } = data

    // collections.value = collectionEntities

    collections.value = collectionEntities.map((collection) => ({
      ...collection,
      lastIndexUsed: Number(collection.nfts?.at(0)?.index || 0),
      alreadyMinted: collection.nfts?.length,
    }))
  }

  const doFetchWithErrorHandling = () =>
    doFetch().catch((error) => {
      $consola.error(
        `Error fetching collections for account ${accountId.value}:`,
        error
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
  collection: MintedCollection
) => {
  const { blockNumber, transaction, isLoading, status, isError } =
    useTransaction()
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

  const willItList = tokens.some(
    (token) => token.price && Number(token.price) > 0
  )
  const isBsx = computed(
    () => urlPrefix.value === 'bsx' || urlPrefix.value === 'snek'
  )

  if (willItList) {
    if (isBsx.value) {
      simpleMint()
    } else {
      // kusama
      const mintAndListResults = kusamaMintAndList(tokens)
      watchEffect(() => {
        collectionUpdated.value = mintAndListResults.collectionUpdated.value
        isLoading.value = mintAndListResults.isLoading.value
        status.value = mintAndListResults.status.value
        blockNumber.value = mintAndListResults.blockNumber.value
        isError.value = mintAndListResults.isError.value
      })
    }
  } else {
    //nothing to list, just mint
    simpleMint()
  }
  return {
    blockNumber,
    isLoading,
    status,
    collectionUpdated,
    isError,
  }
}
