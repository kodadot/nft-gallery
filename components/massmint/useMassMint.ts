import { unwrapSafe } from '@/utils/uniquery'
import resolveQueryPath from '@/utils/queryPathResolver'
import shouldUpdate from '@/utils/shouldUpdate'
import { NFTToMint, Status } from './types'
import { Interaction } from '@kodadot1/minimark/v1'
import { MintedCollection, TokenToMint } from '@/composables/transaction/types'

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

export const useMassMint = () => {
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

  doFetch()

  watch(accountId, (newId, oldId) => {
    if (shouldUpdate(newId, oldId)) {
      doFetch()
    }
  })

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

// composable function the recieves one nft and performs transaction using useTransaction composable

export const mint = (nfts: NFTToMint[], collection: MintedCollection) => {
  const { blockNumber, transaction, isLoading } = useTransaction()

  const tokens: TokenToMint[] = nfts.map((nft) => ({
    file: nft.file,
    name: nft.name,
    description: nft.description || '',
    edition: 1,
    secondFile: null,
    selectedCollection: collection,
    price: nft.price === undefined ? 0 : nft.price * Math.pow(10, 12),
    nsfw: false,
    postfix: true,
    tags: [],
  }))

  transaction({
    interaction: Interaction.MINTNFT,
    urlPrefix: usePrefix().urlPrefix.value,
    token: tokens,
  })
}
