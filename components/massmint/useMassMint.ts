import { unwrapSafe } from '@/utils/uniquery'
import resolveQueryPath from '@/utils/queryPathResolver'
import shouldUpdate from '@/utils/shouldUpdate'
import { NFTToMint, Status } from './types'
import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import {
  MintedCollection,
  TokenToList,
  TokenToMint,
} from '@/composables/transaction/types'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { Ref } from 'vue'
import { toNFTId } from '../rmrk/service/scheme'
import { min } from 'cypress/types/lodash'
import { s } from 'vitest/dist/types-e3c9754d'

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

const subscribeToCollectionUpdates = (collectionId: string) => {
  const collectionUpdated = ref(false)
  const numOfNftsInCollections = ref<number>()

  useSubscriptionGraphql({
    query: `  collection: collectionEntityById(id: "${collectionId}") {
      id
      name
      nfts(
        orderBy: [updatedAt_DESC]
        where: { burned_eq: false }
      ) {
        id
        name
        sn
  
      }
    }`,
    onChange: ({ data }) => {
      const collection = data.collection
      const currentNumberOfNts = collection.nfts.length
      if (numOfNftsInCollections.value === undefined) {
        numOfNftsInCollections.value = currentNumberOfNts
        return
      }

      if (currentNumberOfNts > numOfNftsInCollections.value) {
        collectionUpdated.value = true
      }
    },
  })

  return collectionUpdated
}

const listForSell = (mintedNFts: TokenToList[]) => {
  const { blockNumber, transaction, isLoading, status } = useTransaction()
  const { urlPrefix } = usePrefix()

  transaction({
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token: mintedNFts,
    // successMessage: $i18n.t('transaction.price.success') as string,
    // errorMessage: $i18n.t('transaction.price.error') as string,
  })
  return {
    blockNumber,
    isLoading,
    status,
  }
}

const getListForSellItems = (
  createdNFTs: CreatedNFT[],
  tokens: TokenToMint[],
  blockNumber: string
) => {
  const { $consola } = useNuxtApp()
  return createdNFTs
    .map((nft: CreatedNFT) => {
      const matchingToken = tokens.find(
        (token) =>
          token.name === nft?.name &&
          token?.selectedCollection?.id === nft.collection
      )

      if (matchingToken === undefined) {
        $consola.error('matching token not found', nft)
        return
      }
      if (matchingToken.price === undefined) {
        return
      }
      const nftId = toNFTId(nft, blockNumber)
      if (nftId === undefined) {
        return
      }
      return {
        nftId,
        price: matchingToken.price,
      }
    })
    .filter(Boolean) as TokenToList[]
}

const mintKusama = async (tokens) => {
  const { blockNumber, transaction, isLoading, status } = useTransaction()
  const { urlPrefix } = usePrefix()
  const { createdNFTs } = (await transaction({
    interaction: Interaction.MINTNFT,
    urlPrefix: urlPrefix.value,
    token: tokens,
  })) as {
    createdNFTs: Ref<CreatedNFT[]>
  }

  return {
    blockNumber,
    isLoading,
    status,
    createdNFTs,
  }
}

const kusamaMintAndList = (tokens) => {
  const status = ref('')
  const isLoading = ref(false)
  const collectionUpdated = ref(true)
  const itemsToList = ref<TokenToList[]>()
  const blockNumber = ref<string>()

  const listForSellResults = {
    isLoading: ref(false),
    status: ref(''),
    blockNumber: ref<string>(),
  }

  onMounted(async () => {
    const { blockNumber: mintBlockNumber, createdNFTs } = await mintKusama(
      tokens
    )
    watch([mintBlockNumber, createdNFTs], () => {
      if (mintBlockNumber.value && createdNFTs.value) {
        itemsToList.value = getListForSellItems(
          createdNFTs.value,
          tokens,
          mintBlockNumber.value
        )

        const {
          blockNumber: listBlockNumber,
          isLoading: isLoadingList,
          status: listStatus,
        } = listForSell(itemsToList.value)
        listForSellResults.blockNumber.value = listBlockNumber.value
        listForSellResults.isLoading.value = isLoadingList.value
        listForSellResults.status.value = listStatus.value
      }
    })

    watchEffect(() => {
      if (listForSellResults.isLoading.value === false) {
        status.value = listForSellResults.status.value
        isLoading.value = listForSellResults.isLoading.value
        collectionUpdated.value = true
        blockNumber.value = listForSellResults.blockNumber.value
      }
    })
  })

  return {
    status,
    isLoading,
    collectionUpdated,
    blockNumber,
  }
}

export const mint = (nfts: NFTToMint[], collection: MintedCollection) => {
  const { blockNumber, transaction, isLoading, status } = useTransaction()
  const collectionUpdated = ref(false)
  const { urlPrefix } = usePrefix()

  const simpleMint = () => {
    transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: urlPrefix.value,
      token: tokens,
    })
    const collectionUpdatedTemp = subscribeToCollectionUpdates(collection.id)
    let watchTriggered = false

    watch(collectionUpdatedTemp, (isDone) => {
      watchTriggered = true
      collectionUpdated.value = isDone
    })

    setTimeout(() => {
      if (!watchTriggered) {
        collectionUpdated.value = true
      }
    }, 10000)
  }

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
  const willItList = tokens.some(
    (token) => token.price && Number(token.price) > 0
  )
  const isBsx = urlPrefix.value === 'bsx' || urlPrefix.value === 'snek'

  if (willItList) {
    if (isBsx) {
      simpleMint()
    } else {
      // kusama
      const mintAndListResults = kusamaMintAndList(tokens)
      watch(mintAndListResults.collectionUpdated, (isDone) => {
        collectionUpdated.value = isDone
        isLoading.value = mintAndListResults.isLoading.value
        status.value = mintAndListResults.status.value
        blockNumber.value = mintAndListResults.blockNumber.value
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
  }
}
