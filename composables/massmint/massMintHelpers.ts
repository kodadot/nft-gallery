import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import {
  MintedCollection,
  TokenToList,
  TokenToMint,
} from '@/composables/transaction/types'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { EntityWithId, getNftId } from '@/components/rmrk/service/scheme'
import { NFTToMint } from '@/components/massmint/types'

export const createTokensToMint = (
  nfts: NFTToMint[],
  collection: MintedCollection
): TokenToMint[] => {
  return nfts.map((nft) => ({
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
}
export const subscribeToCollectionLengthUpdates = (collectionId: string) => {
  const collectionUpdated = ref(false)
  const numOfNftsInCollections = ref<number>()

  useSubscriptionGraphql({
    query: `  collection: collectionEntityById(id: "${collectionId}") {
        id
        nfts(
          orderBy: [updatedAt_DESC]
          where: { burned_eq: false }
        ) {
          id

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

export const listForSell = (mintedNFts: TokenToList[]) => {
  const isLoading = ref(true)
  const {
    blockNumber,
    transaction,
    isLoading: tempIsLoading,
    status,
    isError,
  } = useTransaction()
  const { urlPrefix } = usePrefix()
  const { $i18n } = useNuxtApp()

  watch(tempIsLoading, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      isLoading.value = newVal
    }
  })

  transaction({
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token: mintedNFts,
    successMessage: $i18n.t('transaction.price.success') as string,
    errorMessage: $i18n.t('transaction.price.error') as string,
  })
  return {
    blockNumber,
    isLoading,
    status,
    isError,
  }
}

export const getListForSellItems = (
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
          token.selectedCollection?.id === nft.collection
      )

      if (matchingToken === undefined) {
        $consola.error('matching token not found', nft)
        return undefined
      }
      if (matchingToken.price === undefined) {
        return undefined
      }
      const nftId = getNftId(
        {
          ...nft,
          name: nft.name.toUpperCase().replace(/ /g, '_'),
          collection: matchingToken.selectedCollection as EntityWithId,
        },
        blockNumber
      )
      if (nftId === undefined) {
        return undefined
      }
      return {
        nftId,
        price: matchingToken.price,
      }
    })
    .filter(Boolean) as TokenToList[]
}

export const mintKusama = (tokens) => {
  const { blockNumber, transaction, isLoading, status, isError } =
    useTransaction()
  const { urlPrefix } = usePrefix()
  const createdNFTs = ref<CreatedNFT[]>()
  transaction({
    interaction: Interaction.MINTNFT,
    urlPrefix: urlPrefix.value,
    token: tokens,
  }).then((result) => {
    if (typeof result === 'object' && result?.createdNFTs) {
      createdNFTs.value = result?.createdNFTs.value as CreatedNFT[]
    }
  })

  return {
    blockNumber,
    isLoading,
    status,
    createdNFTs,
    isError,
  }
}

export const kusamaMintAndList = (tokens) => {
  const status = ref(TransactionStatus.Unknown)
  const isLoading = ref(true)
  const collectionUpdated = ref(false)
  const blockNumber = ref<string>()
  const isError = ref(false)

  const {
    blockNumber: mintBlockNumber,
    createdNFTs,
    status: mintStatus,
    isError: mintIsError,
  } = mintKusama(tokens)
  watch([mintBlockNumber, createdNFTs, mintStatus, mintIsError], () => {
    status.value = mintStatus.value
    blockNumber.value = mintBlockNumber.value
    isError.value = mintIsError.value

    if (mintIsError.value) {
      isLoading.value = false
    }
    if (mintBlockNumber.value && createdNFTs.value) {
      const listForSellItems = getListForSellItems(
        createdNFTs.value,
        tokens,
        mintBlockNumber.value
      )
      const {
        blockNumber: listBlockNumber,
        isLoading: listIsLoading,
        status: listStatus,
        isError: listIsError,
      } = listForSell(listForSellItems)

      watchEffect(() => {
        status.value = listStatus.value
        blockNumber.value = listBlockNumber.value
        isError.value = listIsError.value
        if (!listIsLoading.value || listIsError.value) {
          isLoading.value = false
        }
        if (listBlockNumber.value !== undefined) {
          collectionUpdated.value = true
        }
      })
    }
  })

  return {
    status,
    isLoading,
    collectionUpdated,
    blockNumber,
    isError,
  }
}
